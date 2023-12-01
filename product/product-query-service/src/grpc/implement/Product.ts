// Original file: src/grpc/server.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  ProductDetail as _ProductDetail,
  ProductDetail__Output as _ProductDetail__Output,
} from './ProductDetail';
import type {
  ProductId as _ProductId,
  ProductId__Output as _ProductId__Output,
} from './ProductId';
import type {
  ProductIds as _ProductIds,
  ProductIds__Output as _ProductIds__Output,
} from './ProductIds';
import type {
  Products as _Products,
  Products__Output as _Products__Output,
} from './Products';

export interface ProductClient extends grpc.Client {
  getProduct(
    argument: _ProductId,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;
  getProduct(
    argument: _ProductId,
    callback: grpc.requestCallback<_ProductDetail__Output>
  ): grpc.ClientUnaryCall;

  getProducts(
    argument: _ProductIds,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
  getProducts(
    argument: _ProductIds,
    callback: grpc.requestCallback<_Products__Output>
  ): grpc.ClientUnaryCall;
}

export interface ProductHandlers extends grpc.UntypedServiceImplementation {
  getProduct: grpc.handleUnaryCall<_ProductId__Output, _ProductDetail>;

  getProducts: grpc.handleUnaryCall<_ProductIds__Output, _Products>;
}

export interface ProductDefinition extends grpc.ServiceDefinition {
  getProduct: MethodDefinition<
    _ProductId,
    _ProductDetail,
    _ProductId__Output,
    _ProductDetail__Output
  >;
  getProducts: MethodDefinition<
    _ProductIds,
    _Products,
    _ProductIds__Output,
    _Products__Output
  >;
}
