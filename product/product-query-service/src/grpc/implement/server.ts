import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  ProductClient as _ProductClient,
  ProductDefinition as _ProductDefinition,
} from './Product';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  Product: SubtypeConstructor<typeof grpc.Client, _ProductClient> & {
    service: _ProductDefinition;
  };
  ProductDetail: MessageTypeDefinition;
  ProductId: MessageTypeDefinition;
  ProductIds: MessageTypeDefinition;
  Products: MessageTypeDefinition;
  Shop: MessageTypeDefinition;
}
