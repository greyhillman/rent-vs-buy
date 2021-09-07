import { AccountTree, from_accounts } from "./Account";
import { PropertyExpenses } from "./Buy";

export interface BothIncome {
    investments: number;
    salary: number;
}

export interface Capital<A, L> {
    assets: A;
    liabilities: L;
}

export interface Profit<I, E> {
    income: I;
    expenses: E;
}

export interface OptionBreakdownYear<C, P> {
    capital: C;
    profit: P;
}

export interface OptionBreakdown<C, P> {
    initial: C;
    years: OptionBreakdownYear<C, P>[];
    final: C;
}

export function evaluate_option<C, P>(
    initial: C,
    eval_year: (prev_capital: C, year: number) => OptionBreakdownYear<C, P>,
    num_years: number
): OptionBreakdown<C, P> {
    let year_breakdowns: OptionBreakdownYear<C, P>[] = [];
    let prev_capital = initial;

    for (let year = 1; year <= num_years; year++) {
        const breakdown = eval_year(prev_capital, year);

        prev_capital = breakdown.capital;

        year_breakdowns.push(breakdown);
    }

    const final = year_breakdowns[year_breakdowns.length - 1].capital;

    return {
        initial: initial,
        years: year_breakdowns,
        final: final,
    };
}

export type CapitalAccounts = Capital<AccountTree[], AccountTree[]>;
export type ProfitAccounts = Profit<AccountTree[], AccountTree[]>;

export type CapitalAccount = Capital<AccountTree, AccountTree>;
export type ProfitAccount = Profit<AccountTree, AccountTree>;

export type OptionBreakdownAccounts = OptionBreakdown<
    CapitalAccount,
    ProfitAccount
>;

function get_capital_account(data: CapitalAccounts): CapitalAccount {
    return {
        assets: from_accounts("Assets", data.assets),
        liabilities: from_accounts("Liabilities", data.liabilities),
    };
}

function get_profit_account(data: ProfitAccounts): ProfitAccount {
    return {
        income: from_accounts("Income", data.income),
        expenses: from_accounts("Expenses", data.expenses),
    };
}

export function get_breakdown(
    data: OptionBreakdown<CapitalAccounts, ProfitAccounts>
): OptionBreakdownAccounts {
    const initial = get_capital_account(data.initial);

    const years = data.years.map((year) => {
        return {
            capital: get_capital_account(year.capital),
            profit: get_profit_account(year.profit),
        };
    });

    const final = get_capital_account(data.final);

    return {
        initial,
        years,
        final,
    };
}
