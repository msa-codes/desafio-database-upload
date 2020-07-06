import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface RequestDTO {
  title: string;
  value: number;
  type: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const categoryExist = await categoriesRepository.findOne({
      where: { title: category },
    });

    let category_id = '';

    if (categoryExist?.title !== category) {
      const newCategory = categoriesRepository.create({ title: category });

      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    } else {
      category_id = categoryExist.id;
    }

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError(
        'This transaction cannot be completed: Insufficient balance',
      );
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
