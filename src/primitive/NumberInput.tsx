import { props } from "ramda";
import React from "react";
import "./Input.scss";

interface Props {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (x: number) => void;
    enabled?: boolean;
}

function clamp(x: number, min?: number, max?: number): number {
    if (min) {
        x = Math.max(x, min);
    }
    if (max) {
        x = Math.min(x, max);
    }

    return x;
}

interface Options {
    onChange: (x: number) => void;
    min?: number;
    max?: number;
}

function useOnChange(options: Options): (x: number) => void {
    return (x: number) => {
        options.onChange(clamp(x, options.min, options.max));
    };
}

const NumberInput: React.FC<Props> = (props) => {
    const onChange = useOnChange(props);

    return (
        <input
            type="number"
            min={props.min}
            max={props.max}
            step={props.step ?? 1}
            value={props.value}
            onChange={(event) => onChange(+event.target.value)}
            disabled={!(props.enabled ?? true)}
        />
    );
};

export default NumberInput;
