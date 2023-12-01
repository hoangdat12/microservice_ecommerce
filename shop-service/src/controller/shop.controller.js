import { CREATED, OK } from '../core/success.response.js';
import { AddressService } from '../service/address.service.js';
import ShopService from '../service/shop.service.js';

class ShopController {
  static async getShopInformation(req, res, next) {
    try {
      const shopId = req.params.shopId;
      return new OK(
        await ShopService.getShopInformation({ shop_id: shopId })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async createNewShop(req, res, next) {
    try {
      const {
        shop_name,
        shop_owner,
        shop_description,
        address_user_name,
        address_phone,
        address_city,
        address_detail,
      } = req.body;

      const data = await ShopService.createNewShop({
        shop_name,
        shop_owner,
        shop_description,
        address_user_name,
        address_phone,
        address_city,
        address_detail,
      });

      return new CREATED(data, 'Register shop successfully!').send(res);
    } catch (err) {
      next(err);
    }
  }

  static async updateShopInformation(req, res, next) {
    try {
      const { shopId } = req.params;
      const { payload, user_id } = req.body;
      return new OK(
        await ShopService.updateShopInformation({
          user_id,
          shop_id: shopId,
          payload,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async addNewAddress(req, res, next) {
    try {
      const {
        shop_id,
        address_user_name,
        address_phone,
        address_city,
        address_detail,
      } = req.body;
      return new OK(
        await AddressService.createAddress({
          shop_id,
          address_user_name,
          address_phone,
          address_city,
          address_detail,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async updateAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const { user_id, shop_id, payload } = req.body;
      return new OK(
        await AddressService.updateAddress({
          user_id,
          shop_id,
          address_id: addressId,
          payload,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async deleteAddress(req, res, next) {
    try {
      const { addressId } = req.params;
      const { user_id, shop_id } = req.body;
      return new OK(
        await AddressService.deleteAddress({
          user_id,
          address_id: addressId,
          shop_id,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async findAllAddressOfShop(req, res, next) {
    try {
      const shopId = req.params.shopId;
      return new OK(
        await AddressService.getAddressOfShop({ shop_id: shopId })
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default ShopController;
