export type RentValuation = (year: number) => number;

export interface RentPlace {
    value_at: RentValuation;
    years: number;
}

export interface RentValuationData {
    rent: number;
    rent_change: number;
    includes: {
        utilities: boolean;
        internet: boolean;
    };
    monthly: MonthlyData;
}

interface MonthlyData {
    utilities: number;
    internet: number;
}

export function create_valuation(data: RentValuationData): RentValuation {
    return (year) => {
        return (
            data.rent +
            data.rent_change * (year - 1) +
            (data.includes.utilities ? 0 : data.monthly.utilities) +
            (data.includes.internet ? 0 : data.monthly.internet)
        );
    };
}
