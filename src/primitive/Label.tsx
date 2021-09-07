import React from "react";
import "./Label.scss";

export interface LabelProps {
    name: string;
    help?: string;
}

const Label: React.FC<LabelProps> = (props) => {
    const help = props.help ? <p className="help">{props.help}</p> : undefined;

    return (
        <label>
            <strong>{props.name}</strong>
            <div className="input">{props.children}</div>
            {help}
        </label>
    );
};

export default Label;
