import React from "react";
import { Dynamic, useDynamic } from "../model/Dynamic";

export interface Props {
    value: Dynamic<Values>;
}

export enum Values {
    Monthly = "monthly",
    Yearly = "yearly",
}

const Frequency: React.FC<Props> = (props) => {
    const selected = props.value;

    return (
        <select
            value={selected.current}
            onChange={(e) => selected.update(e.target.value as Values)}
        >
            <option value={Values.Yearly}>Yearly</option>
            <option value={Values.Monthly}>Monthly</option>
        </select>
    );
};

export default Frequency;
