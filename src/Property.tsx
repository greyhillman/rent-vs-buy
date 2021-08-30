import React from "react";
import { Dynamic, useDynamic } from "./model/Dynamic";
import CurrencyOutput from "./primitive/CurrencyOutput";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";

interface Props {
    final_value: number;
    purchase_price: Dynamic<number>;
    roi: Dynamic<number>;
}

const Property: React.FC<Props> = (props) => {
    const purchasePrice = props.purchase_price;
    const roi = props.roi;
    const final_value = props.final_value;

    return (
        <fieldset>
            <legend>Property</legend>
            <Label
                name="Purchase Price"
                help="How much will the property cost to buy? This is typically the value of the property."
            >
                <NumberInput
                    min={0}
                    step={10_000}
                    value={purchasePrice.current}
                    onChange={purchasePrice.update}
                />
            </Label>
            <Label
                name="Rate of return"
                help="What is the expected simple rate of return on the property? How much will the house increase/decrease in value each year?"
            >
                <NumberInput
                    step={1}
                    value={roi.current}
                    onChange={roi.update}
                />
            </Label>
            <Label
                name="Final value"
                help="This is the final value of the property."
            >
                <CurrencyOutput value={final_value} />
            </Label>
        </fieldset>
    );
};

export default Property;
