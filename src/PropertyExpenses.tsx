import React from "react";
import { Dynamic } from "./model/Dynamic";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";
import PercentInput from "./primitive/PercentInput";

interface Props {
    tax_rate: Dynamic<number>;
    maintenance: Dynamic<number>;
    additional: Dynamic<number>;
}

const PropertyExpenses: React.FC<Props> = (props) => {
    return (
        <fieldset>
            <legend>Expenses</legend>
            <p className="help">
                These are expenses that are specific to buying and not renting.
                These are typically the hidden costs you might not think of when
                living at a property.
            </p>
            <fieldset>
                <legend>Property Taxes</legend>
                <Label
                    name="Rate (%)"
                    help="Most property taxes are a percent of the assessed value of the property. The assess value is essentially the amount the house would be sold for."
                >
                    <PercentInput
                        value={props.tax_rate.current}
                        onChange={props.tax_rate.update}
                        step={0.05}
                    />
                </Label>
            </fieldset>
            <Label
                name="Maintenance"
                help="How much would you spend per year on maintenance and upkeep of the property? This includes replacing appliances, gardening, plumbing, etc."
            >
                <NumberInput
                    min={0}
                    step={100}
                    value={props.maintenance.current}
                    onChange={props.maintenance.update}
                />
            </Label>
            <Label
                name="Additional Fees"
                help="How much would you spend in additional fees per year? This can include Strata fees if the property is a condo, or even Homeowner Association fees."
            >
                <NumberInput
                    min={0}
                    step={100}
                    value={props.additional.current}
                    onChange={props.additional.update}
                />
            </Label>
        </fieldset>
    );
};

export default PropertyExpenses;
