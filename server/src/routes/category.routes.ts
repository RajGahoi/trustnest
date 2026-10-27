import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';

export const categoryRouter = Router();

categoryRouter.get('/', CategoryController.getCategories);
categoryRouter.get('/:slug', CategoryController.getCategoryBySlug);
