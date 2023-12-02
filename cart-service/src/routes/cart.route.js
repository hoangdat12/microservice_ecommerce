import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';
// import verifyAccessToken from '../middleware/verifyAccessToken.js';
import { asyncHandler } from '../helpers/asyncHandler.js';

const router = Router();

// router.post('/create', CartController.createCartForUser);
// router.use(verifyAccessToken);

router.get('/:userId', asyncHandler(CartController.getCart));

router.post('/', asyncHandler(CartController.addProductToCart));

router.patch('/update/quantity', asyncHandler(CartController.updateQuantity));

router.delete(
  '/delete/:productId',
  asyncHandler(CartController.deleteProductFromCart)
);
router.delete(
  '/delete-multi',
  asyncHandler(CartController.deleteMultiProductFromCart)
);

router.get(
  '/session/:sessionId',
  asyncHandler(CartController.getProductsInCart)
);

router.post('/session', asyncHandler(CartController.addProduct));
router.post(
  '/session/quantity',
  asyncHandler(CartController.updateQuantityProduct)
);

router.delete('/session', asyncHandler(CartController.deleteProduct));

export default router;
