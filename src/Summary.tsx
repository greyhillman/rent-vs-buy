import React from "react";
import CurrencyOutput from "./primitive/CurrencyOutput";

interface Props {
    rent: number;
    buy: number;
}

const Summary: React.FC<Props> = (props) => {
    return (
        <header>
            <h2>Summary</h2>
            <section className="rent">
                <h3>Renting</h3>
                <strong>Asset Value</strong>
                <CurrencyOutput value={props.rent} />
            </section>
            <section className="buy">
                <h3>Buying</h3>
                <CurrencyOutput value={props.buy} />
                <strong>Asset Value</strong>
            </section>
        </header>
    );
};

export default Summary;
