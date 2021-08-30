import React, { useMemo, useState } from "react";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";
import { Dynamic } from "./model/Dynamic";

interface Props {
    utilities: Dynamic<number>;
    internet: Dynamic<number>;
    other: Dynamic<number>;
}

const Expenses: React.FC<Props> = (props) => {
    return (
        <fieldset>
            <legend>Monthly Expenses</legend>
            <Label
                name="Utilities"
                help="How much do you spend on utilities? (hydro + electricity + sewage)"
            >
                <NumberInput
                    min={0}
                    step={100}
                    value={props.utilities.current}
                    onChange={props.utilities.update}
                />
            </Label>
            <Label
                name="Internet"
                help="How much do you spend per monthy on internet?"
            >
                <NumberInput
                    min={0}
                    step={20}
                    value={props.internet.current}
                    onChange={props.internet.update}
                />
            </Label>
            <Label
                name="Other"
                help="How much do you spend per month on other expenses? These should be expenses that are not specific to either renting or buying like groceries, car insurance, etc."
            >
                <NumberInput
                    min={0}
                    step={100}
                    value={props.other.current}
                    onChange={props.other.update}
                />
            </Label>
        </fieldset>
    );
};

export default Expenses;
