import {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} from '../core/error.response.js';
import { AddressRepository } from '../repository/address.repository.js';
import { ShopRepository } from '../repository/shop.repository.js';
import { removeNullOrUndefinedFromRequest } from '../ultils/filter-object-data.js';

export class AddressService {
  static async createAddress({
    shop_id,
    address_user_name,
    address_phone,
    address_city,
    address_detail,
  }) {
    const foundShop = await ShopRepository.findById({ shop_id });
    if (!foundShop) throw new NotFoundError('Shop not found!');

    // Check role

    return await AddressRepository.create({
      shop: foundShop,
      address_user_name,
      address_phone,
      address_city,
      address_detail,
    });
  }

  static async updateAddress({ user_id, address_id, shop_id, payload }) {
    const foundAddressP = await AddressRepository.findById({ address_id });
    const foundShopP = await ShopRepository.findById({ shop_id });

    const [foundShop, foundAddress] = await Promise.all([
      foundShopP,
      foundAddressP,
    ]);

    if (!foundAddress) throw new NotFoundError('Address not found!');
    if (!foundShop) throw new NotFoundError('Shop not found!');
    if (foundAddress.shop.id !== shop_id)
      throw new BadRequestError('Invalid value!');

    if (!foundShop.shop_owner.includes(user_id))
      throw new ForbiddenRequestError('Not permission!');

    const updateData = removeNullOrUndefinedFromRequest(payload);

    return await AddressRepository.updateAddress({
      address_id,
      payload: updateData,
    });
  }

  static async deleteAddress({ user_id, address_id, shop_id }) {
    const foundAddressP = await AddressRepository.findById({ address_id });
    const foundShopP = await ShopRepository.findById({ shop_id });

    const [foundShop, foundAddress] = await Promise.all([
      foundShopP,
      foundAddressP,
    ]);

    if (!foundAddress) throw new NotFoundError('Address not found!');
    if (!foundShop) throw new NotFoundError('Shop not found!');

    if (!foundShop.shop_owner.includes(user_id))
      throw new ForbiddenRequestError('Not permission!');

    return await AddressRepository.delete({ address_id });
  }

  static async getAddressOfShop({ user_id, shop_id }) {
    const foundShop = await ShopRepository.findById({ shop_id });
    if (!foundShop) throw new NotFoundError('Shop not found!');
    if (!foundShop.shop_owner.includes(user_id))
      throw new ForbiddenRequestError('Not permission!');

    const addresses = await AddressRepository.findAddressForShop({ shop_id });

    return addresses;
  }
}
