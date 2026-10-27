import { Request, Response, NextFunction } from 'express';
import { getDatabase } from '../db/connection.js';

export class CategoryController {
  public static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const db = getDatabase();
      const rows = db.prepare('SELECT id, slug, name, icon, description, image, attributes_json FROM categories').all() as any[];
      const categories = rows.map(r => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        icon: r.icon,
        description: r.description,
        image: r.image,
        attributes: JSON.parse(r.attributes_json || '[]')
      }));

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug as string;
      const db = getDatabase();
      const r = db.prepare('SELECT id, slug, name, icon, description, image, attributes_json FROM categories WHERE slug = ?').get(slug) as any;

      if (!r) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found.' } });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          id: r.id,
          slug: r.slug,
          name: r.name,
          icon: r.icon,
          description: r.description,
          image: r.image,
          attributes: JSON.parse(r.attributes_json || '[]')
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
