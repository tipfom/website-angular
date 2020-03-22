export interface CoronaData {
    confirmed: number[];
    dead:  number[];
    recovered:  number[];
    fits: CoronaFits;
}

export interface CoronaFits {
    exp: CoronaFit[];
    sig: CoronaFit[];
}

export interface CoronaFit {
    param: number[];
    err: number[];
}