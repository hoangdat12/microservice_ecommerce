import { USER_SPECIFIC } from '../constant/redis.constant.js';
import {
  BadRequestError,
  ConflictRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/error.response.js';
import CartRepository from '../repository/cart.repository.js';
import { convertArrToKeyValuePair } from '../ultils/func/convertArrToKeyValuePair.js';
import { RedisService } from './redis.service.js';
import { productGrpc } from '../gRPC/client.gRPC.js';
/**
 * addToSet do not add new Item to array if item is exist in array
 * push then not care that
 */

class CartService {
  static async createCartForNewUser({ userId }) {
    const cartExist = await CartRepository.findByUserId({ userId });
    if (cartExist) throw new ConflictRequestError(`User's cart is ready eixst`);
    return await CartRepository.createCartOfUser({ userId });
  }

  /**
   * 1. Add Product To Cart
   *    - Case 1: Cart exist or not
   *    - Case 2: There are product in cart?
   *    - Case 3: Product is exist in cart
   * 2. Product received from Client
   *   {
   *    productId,
   *    olderQuantity,
   *    quantity,
   *    shopId,
   *    name,
   *    price
   *    }
   */

  static async addProductToCart({ userId, productId, quantity }) {
    const cartUserExist = await CartRepository.findProductExist({
      cart_user_id: userId,
      'cart_products.productId': productId,
    });
    if (!cartUserExist) {
      // Check product is exist or not
      // let productIds = [productId];
      let cartUpdated = null;
      const { product } = await clientGRPCForProduct.getProduct({
        productId,
        shopId: userId,
      });
      if (!product) {
        const response = {
          msg: 'Product is not Exist!',
          productIsNotExist: res.productIsNotExist,
        };
        return new BadRequestError(response);
      }
      // Add product to Cart
      cartUpdated = await CartRepository.addProductToCart({
        userId,
        product: {
          productId,
          product_shop: product.product_shop,
          quantity: quantity,
        },
      });
      if (!cartUpdated) throw new InternalServerError('DB error!');
      else return cartUpdated;
    }

    if (cartUserExist) {
      cartUpdated = await CartRepository.updateQuantityOfProductInCart({
        userId,
        productId,
        quantity,
      });
      if (!cartUpdated) throw new InternalServerError('DB error');
      return cartUpdated;
    }
  }

  static async deleteProductFromCart({ userId, productId }) {
    const productExistInCart = await CartRepository.findProductExist({
      userId,
      productId,
    });
    if (!productExistInCart) return {};
    const cartUpdated = await CartRepository.deleteProductFromCart({
      userId,
      productId,
    });
    return cartUpdated;
  }

  // static async deleteMultiProductFromCart({ userId, productIds }) {
  //   const cartUserExist = await CartRepository.findByUserId({ userId });
  //   if (!cartUserExist) throw new NotFoundError('User not found!');
  //   const cartUpdated = await CartRepository.deleteMultiProductFromCart({
  //     userId,
  //     productIds,
  //   });
  //   if (!cartUpdated) throw new NotFoundError('Product not found in Cart!');
  //   else return true;
  // }

  static async deleteMultiProduct({ userId, productIds }) {
    const cartUserExist = await CartRepository.findByUserId({ userId });
    if (!cartUserExist) {
      throw new NotFoundError('User not found!');
    }

    const deletionPromises = productIds.map((productId) =>
      this.deleteProductFromCart({ userId, productId })
    );
    await Promise.all(deletionPromises);

    return true;
  }

  // update cart
  /**
    item_product: 
      {
        productId,
        shopId,
        price,
        new_quantity,
        older_quantity
      }
   */
  static async updateQuantity({ userId, item_product }) {
    const { productId, shopId, new_quantity, older_quantity } = item_product;

    const cartUserExist = await CartRepository.findProductExist({
      userId,
      productId,
    });
    if (!cartUserExist) throw new BadRequestError('Product not found in Cart!');

    // Check product is exist or not
    const { product } = await clientGRPCForProduct.getProduct({
      productId,
      shopId,
    });
    if (!product) {
      const response = {
        msg: 'Product is not Exist!',
        productIsNotExist: res.productIsNotExist,
      };
      return new BadRequestError(response);
    }

    // Update quantity of product

    /*
      If new quantity less or equal 0 then remove it from cart 
      Else then update quantity
    */
    let updateCart = null;
    if (new_quantity <= 0) {
      updateCart = await CartRepository.deleteProductFromCart({
        userId,
        productId,
      });
    } else {
      updateCart = await CartRepository.updateQuantityOfProductInCart({
        userId,
        productId,
        quantity: new_quantity - older_quantity,
      });
    }
    return updateCart;
  }

  static async getCart({ userId }) {
    const cartUserExist = await CartRepository.findByUserId({ userId });
    if (!cartUserExist) throw new NotFoundError('User not found!');
    else return cartUserExist;
  }

  // Redis shopping cart for user non-login
  static async addProduct({ sessionId, productId, quantity }) {
    const key = `${USER_SPECIFIC}${sessionId}`;
    const field = productId;
    const value = quantity;

    if (quantity <= 0) throw BadRequestError('Invalid value!');

    const foundProduct = await RedisService.hget({ key, field });
    if (foundProduct) {
      // Update quantity
      return await RedisService.hincrby({ key, field, incre: quantity });
    } else {
      // Add
      return await RedisService.hset({ key, field, value });
    }
  }

  static async updateQuantityProduct({ sessionId, productId, quantity }) {
    const key = `${USER_SPECIFIC}${sessionId}`;
    const field = productId;
    const value = quantity;

    const foundProduct = await RedisService.hget({ key, field });
    if (!foundProduct) throw new NotFoundError('Product not found!');
    // Update quantity
    const curQuantity = await RedisService.hincrby({
      key,
      field,
      incre: value,
    });
    if (curQuantity <= 0) {
      // Delete product in cart
      return await RedisService.hdel({ key, field });
    }

    return curQuantity;
  }

  static async getProductInCart({ sessionId, page, limit }) {
    const key = `${USER_SPECIFIC}${sessionId}`;
    const offset = (page - 1) * limit;
    const results = await RedisService.hgetall({ key });

    const { ids, productKV } = convertArrToKeyValuePair({
      results,
      offset,
      limit,
    });

    // Get product from Product Query Service
    const products = await productGrpc.getProducts({ ids });

    for (let product of products) {
      product.product_quantity = productKV[product._id];
    }

    return products;
  }

  static async deleteProductInCart({ sessionId, productId }) {
    const key = `${USER_SPECIFIC}${sessionId}`;
    const field = productId;
    return await RedisService.hdel({ key, field });
  }
}

export default CartService;
