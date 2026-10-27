import { Request, Response, NextFunction } from 'express';
import { ListingService } from '../services/listing.service.js';

export class ListingController {
  public static async getListings(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        query,
        category,
        city,
        minPrice,
        maxPrice,
        minTrustScore,
        sellerType,
        sortBy,
        page,
        limit,
        status
      } = req.query;

      const result = ListingService.getListings({
        query: query ? String(query) : undefined,
        category: category ? String(category) : undefined,
        city: city ? String(city) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minTrustScore: minTrustScore ? Number(minTrustScore) : undefined,
        sellerType: sellerType ? String(sellerType) : undefined,
        sortBy: sortBy as any,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 12,
        status: status ? String(status) : undefined
      });

      res.status(200).json({
        success: true,
        data: result.listings,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const cities = ListingService.getCitiesWithCounts();
      res.status(200).json({
        success: true,
        data: cities
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getListing(req: Request, res: Response, next: NextFunction) {
    try {
      const idOrSlug = req.params.idOrSlug as string;
      const listing = ListingService.getListingByIdOrSlug(idOrSlug);
      res.status(200).json({
        success: true,
        data: listing
      });
    } catch (err) {
      next(err);
    }
  }

  public static async createListing(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const draft = req.body;
      const newListing = ListingService.createListing(user, draft);

      res.status(201).json({
        success: true,
        data: newListing,
        message: 'Listing successfully verified and published.'
      });
    } catch (err) {
      next(err);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { status, reason } = req.body;
      const actor = req.user!;

      ListingService.updateListingStatus(id, status, reason, actor);
      res.status(200).json({
        success: true,
        message: `Listing status updated to ${status}.`
      });
    } catch (err) {
      next(err);
    }
  }

  public static async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const listingId = req.params.id as string;
      const userId = req.user!.id;
      const isFavorite = ListingService.toggleFavorite(userId, listingId);

      res.status(200).json({
        success: true,
        data: { isFavorite }
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const favorites = ListingService.getUserFavorites(userId);

      res.status(200).json({
        success: true,
        data: favorites
      });
    } catch (err) {
      next(err);
    }
  }
}
