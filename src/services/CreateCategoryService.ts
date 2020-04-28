import { getRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  title: string;
}

class CreateCategoryService {
  public async execute({ title }: Request): Promise<Category> {
    const categoriesRepostiry = getRepository(Category);

    const categoryExist = await categoriesRepostiry.findOne({
      where: { title },
    });

    if (categoryExist) {
      return categoryExist;
    }

    const category = categoriesRepostiry.create({
      title,
    });

    await categoriesRepostiry.save(category);

    return category;
  }
}

export default CreateCategoryService;
