import ObjectID from 'bson-objectid';
import { Shop } from '../entity/shop.entity.js';
import { AppDataSource } from '../dbs/data-source.js';

const shopRepository = AppDataSource.getRepository(Shop);

export class ShopRepository {
  static async findById({ shop_id }) {
    return await shopRepository.findOne({
      where: {
        id: shop_id,
      },
    });
  }

  static async findByName({ shop_name }) {
    return await shopRepository.findOne({
      where: {
        shop_name: shop_name,
      },
    });
  }

  static async create({ shop_name, shop_owner, shop_description }) {
    const newShop = await shopRepository.save({
      id: ObjectID().toHexString(),
      shop_name,
      shop_description,
      shop_owner: [shop_owner],
    });
    return newShop;
  }

  static async update({ shop_id, payload }) {
    return await shopRepository.update(shop_id, { ...payload });
  }

  // static async findAddressForShop({ shop_id }) {
  //   return await shopRepository
  //     .createQueryBuilder('shop')
  //     .where('id = :id', { id: shop_id })
  //     .leftJoinAndSelect('shop.addresses', 'address')
  //     .getMany();
  // }
}
