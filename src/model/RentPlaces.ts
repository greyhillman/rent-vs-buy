import { RentPlace, RentValuation } from "./RentPlace";

export interface RentPlaces {
    initial: RentPlace[];
    last: RentValuation;
}

export function calculate_total_rent_for(
    places: RentPlaces,
    year: number
): number {
    for (const place of places.initial) {
        if (year <= place.years) {
            return place.value_at(year) * 12;
        }

        year -= place.years;
    }

    return places.last(year) * 12;
}

export function calculate_last_year(
    total_years: number,
    places: RentPlaces
): number {
    return total_years - places.initial.map((p) => p.years).sum();
}

export function update_last(
    places: RentPlaces,
    new_valuation: RentValuation
): RentPlaces {
    return {
        ...places,
        last: new_valuation,
    };
}

export function can_add(total_years: number, places: RentPlaces): boolean {
    return calculate_last_year(total_years, places) > 1;
}

export function add(places: RentPlaces): RentPlaces {
    const last: RentPlace = {
        value_at: places.last,
        years: 1,
    };

    return {
        initial: [...places.initial, last],
        last: (_) => 0,
    };
}

export function update_at(
    places: RentPlaces,
    index: number,
    place: Partial<RentPlace>
): RentPlaces {
    const current_place = places.initial[index];

    const new_place = {
        ...current_place,
        ...place,
    };

    return {
        ...places,
        initial: [
            ...places.initial.slice(0, index),
            new_place,
            ...places.initial.slice(index + 1),
        ],
    };
}
