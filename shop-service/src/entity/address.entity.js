import { EntitySchema } from 'typeorm';
import { ADDRESS_NAME, SHOP_NAME } from '../constant/db.constant.js';

export const Address = new EntitySchema({
  name: ADDRESS_NAME,
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    address_user_name: {
      type: 'varchar',
      length: 30,
      nullable: false,
    },
    address_phone: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    address_city: {
      type: 'text',
      nullable: false,
    },
    address_detail: {
      type: 'text',
      nullable: false,
    },
  },
  relations: {
    shop: {
      type: 'many-to-one',
      target: () => SHOP_NAME, // Using a function to avoid circular dependencies
      inverseSide: 'addresses',
    },
  },
});
