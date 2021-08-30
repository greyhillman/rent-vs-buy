import React from "react";
import "./Checkbox.scss";

interface Props {
    value: boolean;
    onChange: (x: boolean) => void;
}

const Checkbox: React.FC<Props> = (props) => {
    return (
        <input
            type="checkbox"
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
        />
    );
};

export default Checkbox;
