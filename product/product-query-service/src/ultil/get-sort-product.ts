import { ScriptSort } from '@elastic/elasticsearch/lib/api/types';
import { PRODUCT_IDX } from '../constant/els.constant';
import client from '../dbs/init.elastic';
import { IPagination } from './interface/pagination.interface';

export interface IBodySortedQuery {
  offset: number;
  limit: number;
  keyword: string;
  type: string;
  sorted: ScriptSort;
}

export const sortedQuery = async (payload: IBodySortedQuery) => {
  const { offset, limit, keyword, type, sorted } = payload;
  return await client.search({
    index: PRODUCT_IDX,
    body: {
      from: offset,
      size: limit,
      query: {
        bool: {
          must: [
            keyword && keyword !== ''
              ? {
                  match_phrase: {
                    product_name: {
                      query: keyword,
                      slop: 2,
                    },
                  },
                }
              : { match_all: {} },
            type !== ''
              ? {
                  match: {
                    product_type: type,
                  },
                }
              : { match_all: {} },
            // {
            //   match: {
            //     isPublished: true,
            //   },
            // },
          ],
        },
      },
      sort: [
        {
          sorted,
        },
      ],
    },
  });
};

export const categoryProduct = async (
  type: string,
  keyword: string,
  pagination: IPagination
) => {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;
  const products = await client.search({
    index: PRODUCT_IDX,
    body: {
      from: offset,
      size: limit,
      query: {
        bool: {
          must: [
            keyword && keyword !== ''
              ? {
                  match_phrase: {
                    product_name: {
                      query: keyword,
                      slop: 2,
                    },
                  },
                }
              : { match_all: {} },
            {
              match: {
                product_type: type,
              },
            },
            // {
            //   match: {
            //     isPublished: true,
            //   },
            // },
          ],
        },
      },
    },
  });

  return products;
};

async function sortProductByPriceDesc(
  type: string,
  keyword: string,
  pagination: IPagination
) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;
  const payload = {
    offset,
    limit,
    keyword,
    type,
    sorted: {
      product_price: {
        order: 'desc',
      },
    } as unknown as ScriptSort,
  };

  return await sortedQuery(payload);
}

async function sortProductByPriceAsc(
  type: string,
  keyword: string,
  pagination: IPagination
) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;
  const payload = {
    offset,
    limit,
    keyword,
    type,
    sorted: {
      product_price: {
        order: 'asc',
      },
    } as unknown as ScriptSort,
  };

  return await sortedQuery(payload);
}

async function sortedProductBySaleNumber(
  type: string,
  keyword: string,
  pagination: IPagination
) {
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;
  const payload = {
    offset,
    limit,
    keyword,
    type,
    sorted: {
      product_sale_number: {
        order: 'desc',
      },
    } as unknown as ScriptSort,
  };

  return await sortedQuery(payload);
}

export const sortedProduct = {
  'price.desc': sortProductByPriceAsc,
  'price.asc': sortProductByPriceDesc,
  sale_number: sortedProductBySaleNumber,
  relative: categoryProduct,
};
