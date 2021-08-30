import React, { useMemo } from "react";
import "./App.scss";
import Both from "./Both";
import { ValueProp as BreakdownValueProps } from "./Breakdown";
import Buy from "./Buy";
import { useDynamic } from "./model/Dynamic";
import Rent from "./Rent";
import Summary from "./Summary";
import DualBreakdown from "./DualBreakdown";
import {
    BuyData,
    calculate_buy_breakdown,
    get_buy_breakdown,
    PropertyExpenses,
} from "./model/Buy";
import { get_breakdown } from "./model/Option";
import {
    calculate_rent_breakdown,
    get_rent_breakdown,
    RentData,
} from "./model/Rent";
import { NumberTree } from "./model/Tree";

interface BuyHookData {
    years: number;
    principal: number;
    monthly_expenses: {
        utilities: number;
        internet: number;
        other: number;
    };
    income: {
        salary: number;
        roi: number;
    };
}

function useBuy(data: BuyHookData) {
    const downpayment = useDynamic(50_000);
    const monthly_payment = useDynamic(0);

    const mortgage_value = useDynamic((year: number): number => 0);
    const mortgage = {
        downpayment: downpayment.current,
        value_at: mortgage_value.current,
        monthly_payment: monthly_payment.current,
    };

    const house_value = useDynamic((year: number): number => 0);

    const expenses_for = useDynamic(
        (year: number): PropertyExpenses => {
            return {
                tax: 0,
                additional: 0,
                maintenance: 0,
            };
        }
    );

    const buy_data: BuyData = useMemo(() => {
        const monthly = {
            utilities: data.monthly_expenses.utilities * 12,
            internet: data.monthly_expenses.internet * 12,
            other: data.monthly_expenses.other * 12,
        };

        return {
            years: data.years,
            assets: {
                principal: data.principal,
                property: house_value.current,
            },
            income: data.income,
            expenses: {
                monthly: monthly,
                mortgage: mortgage,
                property: expenses_for.current,
            },
        };
    }, [
        data.years,
        data.principal,
        house_value.current,
        data.income,
        data.monthly_expenses.utilities,
        data.monthly_expenses.internet,
        data.monthly_expenses.other,
        mortgage.value_at,
        mortgage.downpayment,
        mortgage.monthly_payment,
        expenses_for.current,
    ]);

    const buy_breakdown = useMemo(() => {
        return calculate_buy_breakdown(buy_data);
    }, [buy_data]);

    const profit = useMemo(() => {
        const total_assets =
            buy_breakdown.final.assets.investments +
            buy_breakdown.final.assets.property;

        const total_liabilities = buy_breakdown.final.liabilities.mortgage;

        return total_assets - total_liabilities;
    }, [buy_breakdown]);

    const states = useMemo(() => {
        return get_buy_breakdown(buy_breakdown);
    }, [buy_breakdown]);

    return {
        mortgage: {
            downpayment,
            value_at: mortgage_value.update,
            monthly_payment,
        },
        property_value: house_value,
        expenses_for,
        profit,
        states,
    };
}

function useIncome() {
    const roi = useDynamic(0);
    const salary = useDynamic(60_000);

    const current = {
        roi: roi.current,
        salary: salary.current,
    };

    return {
        roi,
        salary,
        current,
    };
}

function useMonthlyExpenses() {
    const monthly = {
        utilities: useDynamic(0),
        internet: useDynamic(0),
        other: useDynamic(0),
    };

    const current = {
        utilities: monthly.utilities.current,
        internet: monthly.internet.current,
        other: monthly.other.current,
    };

    return {
        ...monthly,
        current,
    };
}

interface RentHookData {
    years: number;
    principal: number;
    income: {
        salary: number;
        roi: number;
    };
    monthly_expenses: {
        internet: number;
        utilities: number;
        other: number;
    };
}

function useRent(data: RentHookData) {
    const rents = useDynamic((year: number): number => 0);

    const monthly_data = useMemo(() => {
        return {
            internet: data.monthly_expenses.internet,
            utilities: data.monthly_expenses.utilities,
        };
    }, [data.monthly_expenses.utilities, data.monthly_expenses.internet]);

    const rent_data: RentData = useMemo(() => {
        return {
            years: data.years,
            principal: data.principal,
            income: data.income,
            expenses: {
                rent: rents.current,
                other: data.monthly_expenses.other,
            },
        };
    }, [
        data.years,
        data.principal,
        data.income,
        rents.current,
        data.monthly_expenses.other,
    ]);

    const rent_breakdown = useMemo(() => {
        return calculate_rent_breakdown(rent_data);
    }, [rent_data]);

    const profit = useMemo(() => {
        const final_capital = rent_breakdown.final;
        return final_capital.assets.investments;
    }, [rent_data]);

    const states = useMemo(() => {
        return get_rent_breakdown(rent_breakdown);
    }, [rent_breakdown]);

    return {
        states,
        profit,
        monthly_data,
        update: rents.update,
    };
}

function useBoth() {
    const years = useDynamic(10);
    const principal = useDynamic(100_000);

    const monthly_expenses = useMonthlyExpenses();
    const income = useIncome();

    return {
        years,
        principal,
        monthly_expenses,
        income,
    };
}

const App: React.FC = () => {
    const both = useBoth();
    const rent = useRent({
        years: both.years.current,
        principal: both.principal.current,
        income: both.income.current,
        monthly_expenses: both.monthly_expenses.current,
    });
    const buy = useBuy({
        years: both.years.current,
        principal: both.principal.current,
        income: both.income.current,
        monthly_expenses: both.monthly_expenses.current,
    });

    return (
        <main>
            <Summary rent={rent.profit} buy={buy.profit} />
            <Both
                years={both.years}
                monthly={both.monthly_expenses}
                principal={both.principal}
                salary={both.income.salary}
                roi={both.income.roi}
            />
            <Rent
                years={both.years.current}
                monthly={rent.monthly_data}
                onRentChange={rent.update}
            />
            <Buy
                years={both.years.current}
                principal={both.principal.current}
                property_value={buy.property_value.update}
                mortgage={buy.mortgage}
                expenses_for={buy.expenses_for.update}
            />
            <DualBreakdown
                years={both.years.current}
                rent={rent.states}
                buy={buy.states}
            />
        </main>
    );
};

export default App;
