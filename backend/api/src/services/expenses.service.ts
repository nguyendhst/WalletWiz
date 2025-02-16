import { Injectable, Logger } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nest-knexjs';
import {
  EditExpenseDto,
  ExpenseDto,
  NewExpenseDto,
  NewExpensesDto,
} from '../models/Expense';
import { Tables } from '../utils/globals';

@Injectable()
export class ExpensesService {
  private logger = new Logger(ExpensesService.name);

  constructor(@InjectConnection() private readonly knex: Knex) {}

  async create(expense: ExpenseDto) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).insert(expense);
  }

  async getExpensesByUser(user_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({ user_id });
  }

  async getExpenseById(id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({ id }).first();
  }

  async getExpensesByUserAndCategory(user_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({
      user_id,
      category_id,
    });
  }

  async addExpenseToCategory(expense_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id });
  }

  async getExpensesByCategory(category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).where({
      category_id,
    });
  }

  async categorizeExpense(expense_id: string, category_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id });
  }

  async uncategorizeExpense(expense_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id })
      .update({ category_id: null });
  }

  async addExpenses(user_id: string, payload: NewExpensesDto) {
    return this.knex<ExpenseDto>(Tables.EXPENSES).insert(
      payload.expenses.map((expense) => ({ ...expense, user_id })),
    );
  }

  async getExpenseByUserAndId(user_id: string, expense_id: string) {
    return this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ user_id, id: expense_id })
      .first();
  }

  async updateExpense(user_id: string, expense: EditExpenseDto) {
    await this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense.id, user_id })
      .update(expense);
    return this.getExpenseById(expense.id);
  }

  async deleteExpense(user_id: string, expense_id: string) {
    const expense = await this.getExpenseByUserAndId(user_id, expense_id);
    if (!expense) {
      return null;
    }
    await this.knex<ExpenseDto>(Tables.EXPENSES)
      .where({ id: expense_id, user_id })
      .del();
    return expense;
  }
}
