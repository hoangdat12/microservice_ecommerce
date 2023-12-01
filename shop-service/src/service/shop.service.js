import {
  BadRequestError,
  ForbiddenRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/error.response.js';
import { CREATED } from '../core/success.response.js';
import { AddressRepository } from '../repository/address.repository.js';
import { ShopRepository } from '../repository/shop.repository.js';
import { removeNullOrUndefinedFromRequest } from '../ultils/filter-object-data.js';

class ShopService {
  static async createNewShop({
    shop_name,
    shop_owner,
    shop_description,
    address_user_name,
    address_phone,
    address_city,
    address_detail,
  }) {
    // Check user exist or not

    const shopExist = await ShopRepository.findByName({ shop_name });
    if (shopExist) throw new BadRequestError('Shop with name already exist!');

    const newShop = await ShopRepository.create({
      shop_owner,
      shop_name,
      shop_description,
    });

    await AddressRepository.create({
      address_user_name,
      address_phone,
      address_city,
      address_detail,
      shop: newShop,
    });

    if (!newShop) {
      throw new InternalServerError('DB error!');
    }
    return new CREATED('Create shop successfully!', newShop);
  }

  static async updateShopInformation({
    user_id,
    shop_id,
    payload, // payload update data
  }) {
    const foundShop = await ShopRepository.findById({ shop_id });
    if (!foundShop) throw new NotFoundError('Shop not found!');

    // if (!foundShop.shop_owner.includes(user_id))
    //   throw new ForbiddenRequestError('Not permission!');

    const updateData = removeNullOrUndefinedFromRequest(payload);

    return await ShopRepository.update({ shop_id, payload: updateData });
  }

  static async getShopInformation({ shop_id }) {
    const foundShop = await ShopRepository.findById({ shop_id });
    if (!foundShop) throw new NotFoundError('Shop not found!');

    return foundShop;
  }
}

export default ShopService;
