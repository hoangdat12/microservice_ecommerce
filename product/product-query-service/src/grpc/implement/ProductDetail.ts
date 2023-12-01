// Original file: src/grpc/server.proto

import type { Shop as _Shop, Shop__Output as _Shop__Output } from './Shop';

export interface ProductDetail {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_price: number;
  product_type: string;
  product_shop: _Shop;
  product_images: string[];
}

export interface ProductDetail__Output {
  _id: string;
  product_name: string;
  product_thumb: string;
  product_price: number;
  product_type: string;
  product_shop: _Shop;
  product_images: string[];
}
