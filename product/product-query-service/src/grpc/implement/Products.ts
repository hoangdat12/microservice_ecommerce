// Original file: src/grpc/server.proto

import type {
  ProductDetail as _ProductDetail,
  ProductDetail__Output as _ProductDetail__Output,
} from './ProductDetail';

export interface Products {
  products?: _ProductDetail[];
}

export interface Products__Output {
  products: _ProductDetail__Output[];
}
