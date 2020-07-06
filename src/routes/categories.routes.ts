import { Router } from 'express';
import { getRepository } from 'typeorm';

import Category from '../models/Category';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request, response) => {
  const categoriesRepository = getRepository(Category);

  const categories = await categoriesRepository.find();

  return response.json(categories);
});

categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;
  const categoriesRepository = getRepository(Category);

  const category = categoriesRepository.create({ title });

  await categoriesRepository.save(category);

  return response.json(category);
});

export default categoriesRouter;
