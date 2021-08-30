import React, { useEffect } from "react";
import { Dynamic, useDynamic } from "./model/Dynamic";
import { MortgageValuation } from "./model/Mortgage";
import Checkbox from "./primitive/Checkbox";
import CurrencyOutput from "./primitive/CurrencyOutput";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";
import PercentInput from "./primitive/PercentInput";

interface Props {
    principal: number;
    valuation: MortgageValuation;
    monthly_payment: number;

    downpayment: Dynamic<number>;
    length: Dynamic<number>;
    rate: Dynamic<number>;
}

const Mortgage: React.FC<Props> = (props) => {
    const use_principal = useDynamic(false);

    useEffect(() => {
        if (use_principal.current) {
            props.downpayment.update(props.principal);
        }
    }, [props.principal, use_principal.current]);

    return (
        <fieldset>
            <legend>Mortgage</legend>
            <Label
                name="Use principal"
                help="Will you be using all your principal or some of it? If you want a higher downpayment, then also increase your principal, as you can use that money from the downpayment for investments."
            >
                <Checkbox
                    value={use_principal.current}
                    onChange={use_principal.update}
                />
            </Label>
            <Label
                name="Downpayment"
                help="What will be the downpayment on this property? The maximum will be the 'Principal' set earlier."
            >
                <NumberInput
                    min={0}
                    step={10_000}
                    max={props.principal}
                    value={props.downpayment.current}
                    onChange={props.downpayment.update}
                    enabled={!use_principal.current}
                />
            </Label>
            <Label name="Amount" help="The size of the loan.">
                <CurrencyOutput value={props.valuation(0)} />
            </Label>
            <Label name="Length" help="How many years is the mortgage?">
                <NumberInput
                    min={1}
                    step={1}
                    value={props.length.current}
                    onChange={props.length.update}
                />
            </Label>
            <Label name="Interest rate (%)">
                <PercentInput
                    step={0.1}
                    value={props.rate.current}
                    onChange={props.rate.update}
                />
            </Label>
            <Label
                name="Monthly payment"
                help="For a typical mortgage, the interest is compounded monthly and paid monthly until the length of the mortgage."
            >
                <CurrencyOutput value={props.monthly_payment} />
            </Label>
        </fieldset>
    );
};

export default Mortgage;
