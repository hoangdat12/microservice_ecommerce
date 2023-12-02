import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { fileURLToPath } from 'url';
import path from 'path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const packageDefinition = protoLoader.loadSync(
  currentDirectory + '/client.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const product = grpc.loadPackageDefinition(packageDefinition).Product;
// const auth = grpc.loadPackageDefinition(packageDefinition).Auth;

class ProductGrpc {
  static instance;
  clientProduct;

  constructor() {
    this.connect();
  }

  connect() {
    this.clientProduct = new product(
      process.env.PRODUCT_GRPC_SERVER,
      grpc.credentials.createInsecure()
    );
  }

  static getInstance() {
    if (!ProductGrpc.instance) {
      ProductGrpc.instance = new ProductGrpc();
    }
    return ProductGrpc.instance;
  }

  async getProduct({ productId, shopId }) {
    const data = { productId, shopId };
    return new Promise((resolve, reject) => {
      this.clientProduct.getProduct(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  async getProducts({ ids }) {
    const data = { _ids: ids };
    return new Promise((resolve, reject) => {
      this.clientProduct.getProducts(data, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }
}

const productInstance = ProductGrpc.getInstance();
export const productGrpc = productInstance;

// export class ClientGRPCForUser {
//   static clientAuth;

//   constructor() {
//     if (!ClientGRPCForUser.clientAuth) {
//       ClientGRPCForUser.clientAuth = new auth(
//         'localhost:50050',
//         grpc.credentials.createInsecure()
//       );
//     }
//   }

//   async verifyAccessToken({ accessToken, userId }) {
//     const data = { accessToken, userId };
//     return new Promise((resolve, reject) => {
//       ClientGRPCForUser.clientAuth.verifyAccessToken(
//         data,
//         (error, response) => {
//           if (error) {
//             console.log(error);
//             reject(error);
//           } else {
//             resolve(response);
//           }
//         }
//       );
//     });
//   }
// }
