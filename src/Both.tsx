import React from "react";
import Income from "./Income";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";
import { Dynamic } from "./model/Dynamic";
import Expenses from "./Expenses";

interface Props {
    principal: Dynamic<number>;
    years: Dynamic<number>;
    salary: Dynamic<number>;
    roi: Dynamic<number>;
    monthly: {
        utilities: Dynamic<number>;
        internet: Dynamic<number>;
        other: Dynamic<number>;
    };
}

const Both: React.FC<Props> = (props) => {
    return (
        <section className="both">
            <h3>During Both Options</h3>
            <Label
                name="Years"
                help="How many years do you plan on renting or staying?"
            >
                <NumberInput
                    min={1}
                    step={1}
                    value={props.years.current}
                    onChange={props.years.update}
                />
            </Label>
            <Label
                name="Principal"
                help="How much assets do you have before you rent/buy? If you buy, this is typically the downpayment."
            >
                <NumberInput
                    min={0}
                    step={1000}
                    value={props.principal.current}
                    onChange={props.principal.update}
                />
            </Label>
            <Expenses
                internet={props.monthly.internet}
                utilities={props.monthly.utilities}
                other={props.monthly.other}
            />
            <Income salary={props.salary} rate_of_return={props.roi} />
        </section>
    );
};

export default Both;
