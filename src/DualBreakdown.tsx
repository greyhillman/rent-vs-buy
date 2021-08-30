import React from "react";
import TOutline, { Props as TAccountProps } from "./TOutline";
import { ValueProp as BreakdownProps } from "./Breakdown";

import "./DualBreakdown.scss";
import { useDynamic } from "./model/Dynamic";
import {
    Capital,
    CapitalAccounts,
    OptionBreakdownAccounts,
    Profit,
} from "./model/Option";
import { AccountTree, from_accounts } from "./model/Account";

type Props = Dual<OptionBreakdownAccounts> & {
    years: number;
};

interface Dual<T> {
    rent: T;
    buy: T;
}

interface YearSelectProps {
    years: number;
    value: number;
    onChange: (year: number) => void;
}

const YearSelect: React.FC<YearSelectProps> = (props) => {
    const year_options: JSX.Element[] = [];

    for (let year = 1; year <= props.years; year++) {
        year_options.push(
            <option selected={year === props.value} value={year}>
                Year {year}
            </option>
        );
    }

    return (
        <input
            type="range"
            min={1}
            max={props.years}
            step={1}
            value={props.value}
            onChange={(e) => props.onChange(+e.target.value)}
        />
    );
};

const BalanceOutline: React.FC<Capital<AccountTree, AccountTree>> = (props) => {
    return <TOutline left={props.assets} right={props.liabilities} />;
};

const IncomeOutline: React.FC<Profit<AccountTree, AccountTree>> = (props) => {
    return <TOutline left={props.income} right={props.expenses} />;
};

const DualBreakdown: React.FC<Props> = (props) => {
    const year_select = useDynamic(1);

    const year_breakdown = {
        rent: props.rent.years[year_select.current - 1],
        buy: props.buy.years[year_select.current - 1],
    };

    return (
        <section id="breakdown">
            <h3>Breakdown</h3>
            <section className="initial">
                <h4>Initial</h4>
                <BalanceOutline {...props.rent.initial} />
                <BalanceOutline {...props.buy.initial} />
            </section>
            <h4>Year {year_select.current}</h4>
            <YearSelect
                value={year_select.current}
                onChange={year_select.update}
                years={props.years}
            />
            <section className="year">
                <section className="rent">
                    <IncomeOutline {...year_breakdown.rent.profit} />
                    <BalanceOutline {...year_breakdown.rent.capital} />
                </section>
                <section className="buy">
                    <IncomeOutline {...year_breakdown.buy.profit} />
                    <BalanceOutline {...year_breakdown.buy.capital} />
                </section>
            </section>
        </section>
    );
};

export default DualBreakdown;
