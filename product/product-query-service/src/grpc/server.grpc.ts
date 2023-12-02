import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { Types } from 'mongoose';
import { ProtoGrpcType } from './implement/server';
import { ProductClient, ProductHandlers } from './implement/Product';
import { ProductId } from './implement/ProductId';
import { ProductDetail } from './implement/ProductDetail';
import { ProductIds } from './implement/ProductIds';
import { Products } from './implement/Products';
import { ProductRepository } from '../repository/product.repository';
import * as dotenv from 'dotenv';

dotenv.config();
const currentFilePath = __filename;
const currentDirectory = path.dirname(currentFilePath);

const packageDefinition = protoLoader.loadSync(
  path.join(currentDirectory, 'server.proto'),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const SERVER_URI = process.env.GRPC_URI_SERVER;

const product = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

class ServerGRPC {
  async onServer() {
    const server = new grpc.Server();
    server.addService(product.Product.service, {
      getProduct: this.getProduct,
      getProducts: this.getProducts,
    } as ProductHandlers);

    if (!SERVER_URI) throw new Error('Missing Server Uri');

    server.bindAsync(
      SERVER_URI,
      grpc.ServerCredentials.createInsecure(),
      (err, port) => {
        if (err) {
          console.error('Failed to bind server:', err.message);
          return;
        }
        server.start();
        console.log('gRPC server started on port', port);
      }
    );
  }

  async getProduct(
    req: grpc.ServerUnaryCall<ProductId, ProductDetail>,
    res: grpc.sendUnaryData<ProductDetail>
  ) {
    console.log(res, req);
  }

  async getProducts(
    req: grpc.ServerUnaryCall<ProductIds, Products>,
    res: grpc.sendUnaryData<Products>
  ) {
    const ids = req.request._ids;
    console.log(ids);

    if (!ids || ids.length === 0) res(null, null);
    else {
      const products = (await ProductRepository.findProductByIds(
        ids
      )) as unknown as ProductDetail[];
      res(null, { products });
    }
  }
}

const serverGrpc = new ServerGRPC();

export default serverGrpc;
