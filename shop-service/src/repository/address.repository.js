import { Address } from '../entity/address.entity.js';
import { AppDataSource } from '../dbs/data-source.js';

const addressRepository = AppDataSource.getRepository(Address);

export class AddressRepository {
  static async findById({ address_id }) {
    return await addressRepository.findOne({
      where: { id: address_id },
      relations: {
        shop: true,
      },
    });
  }

  static async create({
    address_user_name,
    address_phone,
    address_city,
    address_detail,
    shop,
  }) {
    return await addressRepository.save({
      address_user_name,
      address_phone,
      address_city,
      address_detail,
      shop,
    });
  }

  static async updateAddress({ address_id, payload }) {
    return await AppDataSource.createQueryBuilder()
      .update(Address)
      .set({ ...payload })
      .where('id = :id', { id: address_id })
      .execute();
  }

  static async delete({ address_id }) {
    return await addressRepository.delete({ id: address_id });
  }

  static async findAddressForShop({ shop_id }) {
    return await addressRepository.find({
      where: {
        shop: {
          id: shop_id,
        },
      },
    });
  }
}
