import { EntitySchema } from 'typeorm';
import { ADDRESS_NAME, SHOP_NAME } from '../constant/db.constant.js';

export const Shop = new EntitySchema({
  name: SHOP_NAME,
  columns: {
    id: {
      type: 'varchar',
      length: 50,
      nullable: false,
      unique: true,
      primary: true,
    },
    shop_owner: {
      name: 'shop_owner',
      type: 'simple-array',
      default: [],
      nullable: false,
    },
    shop_name: {
      name: 'shop_name',
      type: 'varchar',
      length: 150,
      nullable: false,
    },
    shop_description: {
      name: 'shop_description',
      type: 'text',
    },
    shop_total_product: {
      name: 'shop_total_product',
      type: 'int',
      default: 0,
    },
    shop_followers: {
      name: 'shop_followers',
      type: 'int',
      default: 0,
    },
    shop_following: {
      name: 'shop_following',
      type: 'int',
      default: 0,
    },
    shop_category: {
      name: 'shop_category',
      type: 'simple-array',
      default: [],
    },
    shop_evaluate: {
      name: 'shop_evaluate',
      type: 'int',
      default: 0,
    },
    created_at: {
      name: 'created_at',
      type: 'timestamp',
      createDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
    updated_at: {
      name: 'updated_at',
      type: 'timestamp',
      updateDate: true,
      default: () => 'CURRENT_TIMESTAMP',
    },
  },
  relations: {
    addresses: {
      type: 'one-to-many',
      target: () => ADDRESS_NAME,
      inverseSide: 'shop',
      cascade: true,
    },
  },
});
