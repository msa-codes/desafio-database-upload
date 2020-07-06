import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (acc, ele) => {
        if (ele.type === 'income') {
          acc.income += ele.value;
        }
        if (ele.type === 'outcome') {
          acc.outcome += ele.value;
        }

        return acc;
      },
      { income: 0, outcome: 0 },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
