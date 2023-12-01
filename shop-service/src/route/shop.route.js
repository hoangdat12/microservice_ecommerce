import ShopController from '../controller/shop.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';

const router = new Router();

router.get('/:shopId', asyncHandler(ShopController.getShopInformation));
router.get(
  '/address/:shopId',
  asyncHandler(ShopController.findAllAddressOfShop)
);

router.post('', asyncHandler(ShopController.createNewShop));
router.post('/address', asyncHandler(ShopController.addNewAddress));

router.patch('/:shopId', asyncHandler(ShopController.updateShopInformation));
router.patch('/address/:addressId', asyncHandler(ShopController.updateAddress));

router.delete(
  '/address/:addressId',
  asyncHandler(ShopController.deleteAddress)
);

export default router;
