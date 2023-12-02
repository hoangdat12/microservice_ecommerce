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

const auth = grpc.loadPackageDefinition(packageDefinition).Auth;

class AuthenticateGrpc {
  static instance;
  clientAuthenticate;

  constructor() {
    this.connect();
  }

  connect() {
    this.clientAuthenticate = new auth(
      process.env.AUTHENTICATE_GRPC_SERVER,
      grpc.credentials.createInsecure()
    );
  }

  static getInstance() {
    if (!AuthenticateGrpc.instance) {
      AuthenticateGrpc.instance = new AuthenticateGrpc();
    }
    return AuthenticateGrpc.instance;
  }

  static verifyAccessToken({ userId, accessToken }) {
    const data = { userId, accessToken };
    return new Promise((resolve, reject) => {
      this.clientAuthenticate.verifyAccessToken(data, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

const authenticateInstance = AuthenticateGrpc.getInstance();
export const authenticateGrpc = authenticateInstance;
