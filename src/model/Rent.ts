import { leaf_account } from "./Account";
import {
    BothIncome,
    Capital,
    CapitalAccounts,
    evaluate_option,
    get_breakdown,
    OptionBreakdown,
    OptionBreakdownAccounts,
    OptionBreakdownYear,
    Profit,
    ProfitAccounts,
} from "./Option";
import { RentValuation } from "./RentPlace";

export interface RentData {
    years: number;
    principal: number;
    income: {
        salary: number;
        roi: number;
    };
    expenses: {
        rent: RentValuation;
        other: number;
    };
}

interface RentAssets {
    investments: number;
}

interface RentLiabilities {}

interface RentExpenses {
    rent: number;
    other: number;
}

type RentCapital = Capital<RentAssets, RentLiabilities>;
type RentProfit = Profit<BothIncome, RentExpenses>;

type RentBreakdown = OptionBreakdown<RentCapital, RentProfit>;
type RentBreakdownYear = OptionBreakdownYear<RentCapital, RentProfit>;

export function calculate_rent_breakdown(data: RentData): RentBreakdown {
    const initial = {
        assets: {
            investments: data.principal,
        },
        liabilities: {},
    };

    const fn = (prev_capital: RentCapital, year: number): RentBreakdownYear => {
        const income = {
            investments:
                prev_capital.assets.investments * (data.income.roi / 100),
            salary: data.income.salary,
        };

        const expenses = {
            rent: data.expenses.rent(year),
            other: data.expenses.other * 12,
        };

        const total_income = income.investments + income.salary;
        const total_expenses = expenses.rent + expenses.other;

        const profit = total_income - total_expenses;

        return {
            capital: {
                assets: {
                    investments: prev_capital.assets.investments + profit,
                },
                liabilities: {},
            },
            profit: {
                income,
                expenses,
            },
        };
    };

    return evaluate_option(initial, fn, data.years);
}

function get_capital_accounts(data: RentCapital): CapitalAccounts {
    const investments = leaf_account("Investments", data.assets.investments);
    const assets = [investments];

    return {
        assets,
        liabilities: [],
    };
}

function get_profit_accounts(data: RentProfit): ProfitAccounts {
    const rent = leaf_account("Rent", data.expenses.rent);
    const other = leaf_account("Other", data.expenses.other);

    const expenses = [rent, other];

    const investments = leaf_account("Investments", data.income.investments);
    const salary = leaf_account("Salary", data.income.salary);

    const income = [investments, salary];

    return {
        expenses,
        income,
    };
}

export function get_rent_breakdown(data: RentBreakdown) {
    const initial = get_capital_accounts(data.initial);
    const years = data.years.map(
        (year): OptionBreakdownYear<CapitalAccounts, ProfitAccounts> => {
            return {
                capital: get_capital_accounts(year.capital),
                profit: get_profit_accounts(year.profit),
            };
        }
    );
    const final = get_capital_accounts(data.final);

    return get_breakdown({
        initial,
        years,
        final,
    });
}
