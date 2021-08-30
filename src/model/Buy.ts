import { add } from "ramda";
import { AccountTree, from_accounts, leaf_account } from "./Account";
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
import { PropertyValuation } from "./Property";
import { NumberTree, total } from "./Tree";

export interface BuyData {
    years: number;
    assets: {
        property: PropertyValuation;
        principal: number;
    };
    income: {
        salary: number;
        roi: number;
    };
    expenses: {
        monthly: MonthlyExpenses;
        mortgage: Mortgage;
        property: (year: number) => PropertyExpenses;
    };
}

interface MonthlyExpenses {
    utilities: number;
    internet: number;
    other: number;
}

interface Mortgage {
    downpayment: number;
    value_at: (year: number) => number;
    monthly_payment: number;
}

interface BuyAssets {
    investments: number;
    property: number;
}

interface BuyLiabilities {
    mortgage: number;
}

interface BuyExpenses {
    monthly: {
        utilities: number;
        internet: number;
        other: number;
    };
    mortgage: number;
    property: PropertyExpenses;
}

export interface PropertyExpenses {
    tax: number;
    maintenance: number;
    additional: number;
}

type BuyCapital = Capital<BuyAssets, BuyLiabilities>;
type BuyProfit = Profit<BothIncome, BuyExpenses>;

type BuyBreakdown = OptionBreakdown<BuyCapital, BuyProfit>;
type BuyBreakdownYear = OptionBreakdownYear<BuyCapital, BuyProfit>;

export function calculate_buy_breakdown(data: BuyData): BuyBreakdown {
    const initial: Capital<BuyAssets, BuyLiabilities> = {
        assets: {
            investments:
                data.assets.principal - data.expenses.mortgage.downpayment,
            property: data.assets.property(0),
        },
        liabilities: {
            mortgage: data.expenses.mortgage.value_at(0),
        },
    };

    const fn = (prev_capital: BuyCapital, year: number): BuyBreakdownYear => {
        const income: BothIncome = {
            investments:
                prev_capital.assets.investments * (data.income.roi / 100),
            salary: data.income.salary,
        };
        const expenses: BuyExpenses = {
            monthly: data.expenses.monthly,
            mortgage: data.expenses.mortgage.monthly_payment * 12,
            property: data.expenses.property(year),
        };

        const total_income = total(income);
        const total_expenses = total(expenses);

        const profit = total_income - total_expenses;

        const assets: BuyAssets = {
            investments: prev_capital.assets.investments + profit,
            property: data.assets.property(year),
        };
        const liabilities: BuyLiabilities = {
            mortgage: data.expenses.mortgage.value_at(year),
        };

        return {
            capital: {
                assets,
                liabilities,
            },
            profit: {
                income,
                expenses,
            },
        };
    };

    return evaluate_option(initial, fn, data.years);
}

function get_capital_accounts(data: BuyCapital): CapitalAccounts {
    const investments = leaf_account("Investments", data.assets.investments);
    const property = leaf_account("Property", data.assets.property);
    const assets = [investments, property];

    const mortgage = leaf_account("Mortgage", data.liabilities.mortgage);
    const liabilities = [mortgage];

    return {
        assets,
        liabilities,
    };
}

function get_property_accounts(data: PropertyExpenses): AccountTree {
    const tax = leaf_account("Tax", data.tax);
    const maintenance = leaf_account("Maintenance", data.maintenance);
    const additional = leaf_account("Additional", data.additional);

    return from_accounts("Property", [tax, maintenance, additional]);
}

function get_monthly_accounts(data: MonthlyExpenses): AccountTree {
    const utilities = leaf_account("Utilities", data.utilities);
    const internet = leaf_account("Internet", data.internet);
    const other = leaf_account("Other", data.other);

    return from_accounts("Monthly", [utilities, internet, other]);
}

function get_profit_accounts(data: BuyProfit): ProfitAccounts {
    const property = get_property_accounts(data.expenses.property);
    const mortgage = leaf_account("Mortgage", data.expenses.mortgage);
    const monthly = get_monthly_accounts(data.expenses.monthly);

    const expenses = [property, mortgage, monthly];

    const investments = leaf_account("Investments", data.income.investments);
    const salary = leaf_account("Salary", data.income.salary);

    const income = [investments, salary];

    return {
        expenses,
        income,
    };
}

export function get_buy_breakdown(data: BuyBreakdown): OptionBreakdownAccounts {
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
