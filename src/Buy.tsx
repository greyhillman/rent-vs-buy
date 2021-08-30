import React, { useCallback, useEffect, useMemo } from "react";
import { PropertyExpenses as PropertyExpensesData } from "./model/Buy";
import { Dynamic, useDynamic } from "./model/Dynamic";
import { Event } from "./model/Event";
import {
    calculate_monthly_rate,
    get_mortgage_values,
    Mortgage as MortgageData,
    MortgageValuation,
} from "./model/Mortgage";
import {
    create_valuation,
    PropertyData,
    PropertyValuation,
} from "./model/Property";
import Mortgage from "./Mortgage";
import Property from "./Property";
import PropertyExpenses from "./PropertyExpenses";

interface Props {
    years: number;
    principal: number;
    mortgage: {
        downpayment: Dynamic<number>;
        monthly_payment: Dynamic<number>;
        value_at: Event<MortgageValuation>;
    };
    property_value: Event<PropertyValuation>;
    expenses_for: Event<ExpensesFor>;
}

type ExpensesFor = (year: number) => PropertyExpensesData;

function useMortgageValuation(data: MortgageData): MortgageValuation {
    const values = useMemo(() => {
        return get_mortgage_values(data);
    }, [data.interest_rate, data.length, data.value]);

    return useCallback(
        (year) => {
            return values[year];
        },
        [values]
    );
}

function useMortgage(house_price: number) {
    const downpayment = useDynamic(50_000);
    const length = useDynamic(25);
    const rate = useDynamic(3);

    const data: MortgageData = useMemo(() => {
        return {
            interest_rate: rate.current / 100,
            length: length.current,
            value: house_price - downpayment.current,
        };
    }, [rate.current, length.current, house_price, downpayment.current]);

    const valuation = useMortgageValuation(data);
    const monthly_payment = calculate_monthly_rate(data);

    return {
        downpayment,
        length,
        rate,
        valuation,
        monthly_payment,
    };
}

function useProperty() {
    const value = useDynamic(300_000);
    const roi = useDynamic(5);

    const data: PropertyData = useMemo(() => {
        return {
            initial_value: value.current,
            roi: roi.current / 100,
        };
    }, [value.current, roi.current]);

    const valuation = useCallback(create_valuation(data), [data]);

    return {
        value,
        roi,
        valuation,
    };
}

function usePropertyExpenses() {
    const tax_rate = useDynamic(3);
    const maintenance = useDynamic(0);
    const additional = useDynamic(0);

    return {
        tax_rate,
        maintenance,
        additional,
    };
}

interface ExpensesForData {
    property_value: PropertyValuation;
    property_tax_rate: number;
    maintenance: number;
    additional: number;
}

function useTotalExpenses(data: ExpensesForData): ExpensesFor {
    return useCallback(
        (year: number): PropertyExpensesData => {
            return {
                tax: data.property_value(year) * data.property_tax_rate,
                maintenance: data.maintenance,
                additional: data.additional,
            };
        },
        [
            data.property_tax_rate,
            data.property_value,
            data.additional,
            data.maintenance,
        ]
    );
}

const Buy: React.FC<Props> = (props) => {
    const property = useProperty();
    const mortgage = useMortgage(property.value.current);
    const expenses = usePropertyExpenses();
    const total_expenses_for = useTotalExpenses({
        property_value: property.valuation,
        property_tax_rate: expenses.tax_rate.current / 100,
        additional: expenses.additional.current,
        maintenance: expenses.maintenance.current,
    });

    useEffect(() => {
        props.mortgage.value_at(mortgage.valuation);
        props.mortgage.monthly_payment.update(mortgage.monthly_payment);
        props.mortgage.downpayment.update(mortgage.downpayment.current);
        props.expenses_for(total_expenses_for);
        props.property_value(property.valuation);
    }, [
        mortgage.valuation,
        mortgage.monthly_payment,
        mortgage.downpayment.current,
        total_expenses_for,
        property.valuation,
    ]);

    return (
        <section className="buy">
            <h3>Buying</h3>
            <Property
                purchase_price={property.value}
                roi={property.roi}
                final_value={property.valuation(props.years)}
            />
            <Mortgage
                principal={props.principal}
                rate={mortgage.rate}
                length={mortgage.length}
                valuation={mortgage.valuation}
                downpayment={mortgage.downpayment}
                monthly_payment={mortgage.monthly_payment}
            />
            <PropertyExpenses
                tax_rate={expenses.tax_rate}
                maintenance={expenses.maintenance}
                additional={expenses.additional}
            />
        </section>
    );
};

export default Buy;
