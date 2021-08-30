import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dynamic, useDynamic } from "./model/Dynamic";
import { RentPlace as RentPlaceData, RentValuation } from "./model/RentPlace";
import RentPlace, { Length } from "./RentPlace";
import "./model/Array";
import { Event } from "./model/Event";

import * as R from "ramda";
import {
    add,
    calculate_last_year,
    calculate_total_rent_for,
    can_add,
    RentPlaces as RentPlacesData,
    update_at,
    update_last,
} from "./model/RentPlaces";

import "./RentPlaces.scss";

interface Props {
    years: number;
    monthly: {
        utilities: number;
        internet: number;
    };
    valuation: Event<RentValuation>;
}

function useRentPlaces(total_years: number) {
    const places = useDynamic<RentPlacesData>({
        initial: [],
        last: (_) => 0,
    });

    const valuation = useCallback(
        R.partial(calculate_total_rent_for, [places.current]),
        [places.current]
    );

    return {
        places: places.current,
        add_enabled: can_add(total_years, places.current),
        add: () => {
            places.update(add(places.current));
        },
        update_initial: (index: number, new_place: Partial<RentPlaceData>) => {
            places.update(update_at(places.current, index, new_place));
        },
        update_last: (valuation: RentValuation) => {
            places.update(update_last(places.current, valuation));
        },
        valuation,
    };
}

interface LastRentPlaceProps {
    valuation: RentValuation;
    update_last: (valuation: RentValuation) => void;
    years: number;
    monthly: {
        utilities: number;
        internet: number;
    };
}

const LastRentPlace: React.FC<LastRentPlaceProps> = (props) => {
    const true_rent = {
        current: props.valuation,
        update: props.update_last,
    };

    const length: Length = {
        enabled: false,
        value: {
            current: props.years,
            update: (_) => {
                throw new Error("Can't update last place's years.");
            },
        },
    };

    return (
        <RentPlace
            true_rent={true_rent}
            monthly={props.monthly}
            years={length}
        />
    );
};

const RentPlaces: React.FC<Props> = (props) => {
    const {
        places,
        add,
        update_initial,
        update_last,
        add_enabled,
        valuation: total_valuation,
    } = useRentPlaces(props.years);

    useEffect(() => {
        props.valuation(total_valuation);
    }, [total_valuation]);

    return (
        <section className="places">
            <ol>
                {places.initial.map((place, index) => {
                    const true_rent: Dynamic<RentValuation> = {
                        current: place.value_at,
                        update: (new_valuation) => {
                            update_initial(index, { value_at: new_valuation });
                        },
                    };

                    const years: Length = {
                        value: {
                            current: place.years,
                            update: (new_year) => {
                                update_initial(index, { years: new_year });
                            },
                        },
                        enabled: true,
                    };

                    return (
                        <li key={index}>
                            <RentPlace
                                true_rent={true_rent}
                                monthly={props.monthly}
                                years={years}
                            />
                        </li>
                    );
                })}
                <li>
                    <LastRentPlace
                        monthly={props.monthly}
                        update_last={update_last}
                        valuation={places.last}
                        years={calculate_last_year(props.years, places)}
                    />
                </li>
            </ol>
            <button onClick={add} disabled={!add_enabled}>
                Add place to rent
            </button>
        </section>
    );
};

export default RentPlaces;
