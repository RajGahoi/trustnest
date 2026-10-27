import { Router } from 'express';
import { ListingController } from '../controllers/listing.controller.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

export const listingRouter = Router();

listingRouter.get('/', ListingController.getListings);
listingRouter.get('/cities', ListingController.getCities);
listingRouter.get('/favorites/me', authenticateToken, ListingController.getFavorites);
listingRouter.get('/:idOrSlug', ListingController.getListing);
listingRouter.post('/', authenticateToken, ListingController.createListing);
listingRouter.post('/:id/favorite', authenticateToken, ListingController.toggleFavorite);
listingRouter.patch('/:id/status', authenticateToken, requireRole(['ADMIN', 'MODERATOR', 'SELLER']), ListingController.updateStatus);
