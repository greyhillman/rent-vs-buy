import React from "react";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";
import PercentInput from "./primitive/PercentInput";
import { Dynamic } from "./model/Dynamic";

interface Props {
    salary: Dynamic<number>;
    rate_of_return: Dynamic<number>;
}

const Test: React.FC<Props> = (props) => {
    return (
        <fieldset>
            <legend>Yearly Income</legend>
            <Label
                name="Gross income"
                help="What is your yearly gross income? This is your income before taxes and expenses."
            >
                <NumberInput
                    min={0}
                    step={1_000}
                    value={props.salary.current}
                    onChange={props.salary.update}
                />
            </Label>
            <Label
                name="Rate of return (%)"
                help="What is the compunded rate of return on your investments?"
            >
                <PercentInput
                    value={props.rate_of_return.current}
                    onChange={props.rate_of_return.update}
                />
            </Label>
        </fieldset>
    );
};

export default Test;
