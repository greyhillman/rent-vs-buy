import React from "react";
import "./Input.scss";

interface Props {
    value: number;
    step?: number;
    onChange: (x: number) => void;
}

const PercentInput: React.FC<Props> = (props) => {
    return (
        <input
            min={0}
            max={100}
            step={props.step ?? 1}
            type="number"
            value={props.value}
            onChange={(e) => props.onChange(+e.target.value)}
        />
    );
};

export default PercentInput;
