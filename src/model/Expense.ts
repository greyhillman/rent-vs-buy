import { Frequency } from "./Frequency";

export interface Expense {
    name: string;
    value: number;
    frequency: Frequency;
}
