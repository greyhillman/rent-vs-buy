import React from "react";
import CurrencyOutput, {
    Props as CurrencyOutputProps,
} from "./primitive/CurrencyOutput";
import { AccountTree } from "./model/Account";
import "./TOutline.scss";

export interface Props {
    left: AccountTree;
    right: AccountTree;
}

const BlockCurrencyOutput: React.FC<CurrencyOutputProps> = (props) => {
    return (
        <div>
            <CurrencyOutput {...props} />
        </div>
    );
};

const Account: React.FC<AccountTree> = (props) => {
    const details = props.children || [];
    return (
        <section className="account">
            <strong>{props.name}</strong>
            <BlockCurrencyOutput value={props.value} />
            {details.map((detail) => (
                <Account key={detail.name} {...detail} />
            ))}
        </section>
    );
};

const TOutline: React.FC<Props> = (props) => {
    const details = {
        left: props.left.children || [],
        right: props.right.children || [],
    };

    return (
        <section className="taccount">
            <header>
                <h5>{props.left.name}</h5>
                <h5>{props.right.name}</h5>
            </header>
            <section className="left">
                {details.left.map((detail) => {
                    return <Account key={detail.name} {...detail} />;
                })}
            </section>
            <section className="right">
                {details.right.map((detail) => {
                    return <Account key={detail.name} {...detail} />;
                })}
            </section>
            <footer>
                <BlockCurrencyOutput value={props.left.value} />
                <BlockCurrencyOutput value={props.right.value} />
            </footer>
        </section>
    );
};

export default TOutline;
