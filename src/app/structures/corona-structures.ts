export class CoronaData {
    confirmed: number[];
    dead: number[];
    recovered: number[];
    fits: CoronaFits;

    cachedFits: Map<string, { y: number[], x: Date[], lower: number[], upper: number[] }> = new Map<string, { y: number[], x: Date[], lower: number[], upper: number[] }>();

    constructor(data: CoronaData) {
        this.confirmed = data.confirmed;
        this.dead = data.dead;
        this.recovered = data.recovered;
        this.fits = data.fits;

        this.cacheFits();
    }

    cacheFits(sampleCount: number = 100) {
        let dataStartDate: Date = new Date(2020, 0, 22);
        let axisEndDate: Date = new Date(dataStartDate);
        axisEndDate.setDate(axisEndDate.getDate() + (this.confirmed.length + 3));
        let getRelativeDate = (x: Date) => {
            return (x.getTime() - dataStartDate.getTime()) / (60 * 60 * 24 * 1000);
        };
        let getExpErrormargins = (a, b, da, db, x: Date[]) => {
            let delta = (x: Date) => {
                let rel = getRelativeDate(x);
                return Math.sqrt(
                    Math.pow(Math.exp(b * rel) * da, 2) +
                    Math.pow(a * Math.exp(b * rel) * db, 2)
                );
            }
            let err = [];
            for (var i = 0; i < x.length; i++) {
                err.push(delta(x[i]));
            }
            return err;
        }
        let getSigErrormargins = (a, b, c, da, db, dc, x: Date[]) => {
            let delta = (x: Date) => {
                let rel = getRelativeDate(x);
                return Math.sqrt(
                    Math.pow(1 / (1 + Math.exp(-b * (rel - c))) * da, 2) +
                    Math.pow(-a / Math.pow((1 + Math.exp(-b * (rel - c))), 2) * (c - rel) * Math.exp(-b * (rel - c)) * db, 2) +
                    Math.pow(-a / Math.pow((1 + Math.exp(-b * (rel - c))), 2) * b * Math.exp(-b * (rel - c)) * dc, 2)
                );
            }
            let err = [];
            for (var i = 0; i < x.length; i++) {
                err.push(delta(x[i]));
            }
            return err;
        }

        let x: Date[] = [];
        for (var k = 0; k < sampleCount; k++) {
            let date = new Date(dataStartDate);
            date.setDate(dataStartDate.getDate() + k / sampleCount * getRelativeDate(axisEndDate));
            x.push(date);
        }
        for (let i = 0; i < this.fits.exp.length; i++) {
            let y = [];
            let yLower = [], yUpper = [];

            let a = this.fits.exp[i].param[0], b = this.fits.exp[i].param[1];
            let da = 2 * this.fits.exp[i].err[0], db = 2 * this.fits.exp[i].err[1];
            let err = getExpErrormargins(a, b, da, db, x);
            for (var k = 0; k < sampleCount; k++) {
                let cy = a * Math.exp(b * getRelativeDate(x[k]));
                y.push(cy);
                yLower.push(cy - err[k]);
                yUpper.push(cy + err[k]);
            }
            this.cachedFits.set("exp" + i, { y: y, x: x, lower: yLower, upper: yUpper });
        }
        for (let i = 0; i < this.fits.sig.length; i++) {
            let y = [];
            let yLower = [], yUpper = [];
        
            let a = this.fits.sig[i].param[0], b = this.fits.sig[i].param[1], c = this.fits.sig[i].param[2];
            let da = 2 * this.fits.sig[i].err[0], db = 2 * this.fits.sig[i].err[1], dc = 2 * this.fits.sig[i].err[2];
            let err = getSigErrormargins(a, b, c, da, db, dc, x);
            for (var k = 0; k < sampleCount; k++) {
                let cy = a / (1 + Math.exp(-b * (getRelativeDate(x[k]) - c)));
                y.push(cy);
                yLower.push(cy - err[k]);
                yUpper.push(cy + err[k]);
            }

            this.cachedFits.set("sig" + i, { y: y, x: x, lower: yLower, upper: yUpper })
        }
    }
}

export interface CoronaFits {
    exp: CoronaFit[];
    sig: CoronaFit[];
}

export interface CoronaFit {
    param: number[];
    err: number[];
}

export interface CoronaTestData {
    total: number;
    confirmed_cases: number;
    original_name: string;
    regions: Map<string, number>;
    updated: string;
}