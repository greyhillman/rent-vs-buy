import React, { useCallback, useEffect, useMemo } from "react";
import { Dynamic, useDynamic } from "./model/Dynamic";
import {
    create_valuation,
    RentValuation,
    RentValuationData,
} from "./model/RentPlace";
import Checkbox from "./primitive/Checkbox";
import CurrencyOutput from "./primitive/CurrencyOutput";
import Label from "./primitive/Label";
import NumberInput from "./primitive/NumberInput";

import "./RentPlace.scss";

interface Props {
    true_rent: Dynamic<RentValuation>;
    monthly: {
        utilities: number;
        internet: number;
    };
    max_years: number;
    years: Length;
}

export interface Length {
    value: Dynamic<number>;
    enabled: boolean;
}

interface MonthlyData {
    utilities: number;
    internet: number;
}

const useRentPlace = (monthly: MonthlyData) => {
    const rent = useDynamic(0);
    const include_utilities = useDynamic(false);
    const include_internet = useDynamic(false);
    const rent_change = useDynamic(0);

    const data: RentValuationData = useMemo(() => {
        return {
            rent: rent.current,
            rent_change: rent_change.current,
            includes: {
                utilities: include_utilities.current,
                internet: include_internet.current,
            },
            monthly: monthly,
        };
    }, [
        rent.current,
        rent_change.current,
        include_utilities.current,
        include_internet.current,
        monthly.internet,
        monthly.utilities,
    ]);

    const valuation = useMemo(() => create_valuation(data), [data]);

    return {
        rent,
        include_utilities,
        include_internet,
        rent_change,
        valuation,
    };
};

const RentPlace: React.FC<Props> = (props) => {
    const {
        rent,
        include_utilities,
        include_internet,
        rent_change,
        valuation,
    } = useRentPlace(props.monthly);

    useEffect(() => {
        props.true_rent.update(valuation);
    }, [valuation]);

    return (
        <fieldset className="place">
            <Label
                name="Monthly rent"
                help="How much do you spend per month on rent?"
            >
                <NumberInput
                    min={0}
                    step={100}
                    value={rent.current}
                    onChange={rent.update}
                />
            </Label>
            <Label
                name="Includes utilities"
                help="Does the rent include utilities?"
            >
                <Checkbox
                    value={include_utilities.current}
                    onChange={include_utilities.update}
                />
            </Label>
            <Label
                name="Includes internet"
                help="Does the rent include internet?"
            >
                <Checkbox
                    value={include_internet.current}
                    onChange={include_internet.update}
                />
            </Label>
            <Label
                name="Years renting"
                help="How many years do you expect staying here?"
            >
                <NumberInput
                    min={1}
                    max={props.max_years}
                    step={1}
                    value={props.years.value.current}
                    onChange={props.years.value.update}
                    enabled={props.years.enabled}
                />
            </Label>
            <Label
                name="Rent change ($)"
                help="How much will rent increase/decrease per year?"
            >
                <NumberInput
                    step={50}
                    value={rent_change.current}
                    onChange={rent_change.update}
                />
            </Label>
            <Label
                name="True monthly rent"
                help="This is your rent plus additional costs if they're not included."
            >
                <CurrencyOutput value={valuation(1)} />
            </Label>
        </fieldset>
    );
};

export default RentPlace;
