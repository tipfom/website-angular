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

export interface CoronaTestData {
    total: number;
    confirmed_cases: number;
    original_name: string;
    regions: Map<string, number>;
    updated: string;
}