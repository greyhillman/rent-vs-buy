export type PropertyValuation = (year: number) => number;

export interface PropertyData {
    initial_value: number;
    roi: number;
}

export function create_valuation(data: PropertyData): PropertyValuation {
    return (year: number) => {
        return data.initial_value * (1 + data.roi * year);
    };
}
