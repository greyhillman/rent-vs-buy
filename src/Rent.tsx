import React, { useEffect } from "react";
import { useDynamic } from "./model/Dynamic";
import { Event } from "./model/Event";
import { RentValuation } from "./model/RentPlace";
import RentPlacesData from "./RentPlaces";

interface Props {
    years: number;
    monthly: {
        utilities: number;
        internet: number;
    };
    onRentChange: Event<RentValuation>;
}

function useRent() {
    const valuation = useDynamic<RentValuation>((_) => 0);

    return {
        valuation,
    };
}

const Rent: React.FC<Props> = (props) => {
    const { valuation } = useRent();

    useEffect(() => {
        props.onRentChange(valuation.current);
    }, [valuation.current]);

    return (
        <section className="rent">
            <h3>Renting</h3>
            <RentPlacesData
                years={props.years}
                monthly={props.monthly}
                valuation={valuation.update}
            />
        </section>
    );
};

export default Rent;
