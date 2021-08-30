export interface Mortgage {
    value: number;
    interest_rate: number;
    length: number;
}

export type MortgageValuation = (year: number) => number;

// https://www.wikihow.com/Calculate-Mortgage-Payments#Calculating-Mortgage-Payments-with-an-Equation
export function calculate_monthly_rate(mortgage: Mortgage): number {
    const r = mortgage.interest_rate / 12;
    const n = mortgage.length * 12;
    const P = mortgage.value;

    const monthly_payment = (P * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);

    return monthly_payment;
}

export function get_mortgage_values(data: Mortgage): number[] {
    const values = [];
    let value = data.value;

    values.push(value);

    const monthly_rate = calculate_monthly_rate(data);

    while (value > 0) {
        for (let month = 1; month <= 12; month++) {
            const interest = value * (data.interest_rate / 12);

            value = value + interest - monthly_rate;
        }

        values.push(value);
    }

    return values;
}
