import React from "react";

import "./CurrencyOutput.scss";

export interface Props {
    value: number;
}

const CurrencyOutput: React.FC<Props> = (props) => {
    const CAD = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
    });

    return <output className="currency">{CAD.format(props.value)}</output>;
};

export default CurrencyOutput;
