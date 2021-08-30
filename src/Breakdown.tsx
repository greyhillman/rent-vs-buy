import React from "react";
import TOutline, { Props as TAccountType } from "./TOutline";

export interface ValueProp {
    initial: TAccountType;
    years: {
        capital: TAccountType;
        profit: TAccountType;
    }[];
    final: TAccountType;
}

export interface Props {
    className: string;
    value: ValueProp;
}

const Breakdown: React.FC<Props> = (props) => {
    return (
        <section className={props.className}>
            <h4>Initial</h4>
            <TOutline
                left={props.value.initial.left}
                right={props.value.initial.right}
            />
            <h4>Each year:</h4>
            <ol>
                {props.value.years.map((year, index) => (
                    <li key={index}>
                        <h5>Year {index + 1}</h5>
                        <TOutline
                            left={year.profit.left}
                            right={year.profit.right}
                        />
                        <TOutline
                            left={year.capital.left}
                            right={year.capital.right}
                        />
                    </li>
                ))}
            </ol>
            <h4>Final</h4>
            <TOutline
                left={props.value.final.left}
                right={props.value.final.right}
            />
        </section>
    );
};

export default Breakdown;
