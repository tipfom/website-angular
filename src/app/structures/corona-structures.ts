export interface CoronaDataContainer {
    confirmed: CoronaData;
    dead: CoronaData;
    recovered: CoronaData;
    fits: Map<string, CoronaFit>;
}

export interface CoronaData {
    by_region: Map<string, number[]>,
    total: number[];
}

export interface CoronaFit {
    param: number[];
    err: number[];
}