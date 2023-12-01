import { PRODUCT_IDX } from '../constant/els.constant';
import { BadRequest } from '../core/error.response';
import client from '../dbs/init.elastic';
import { categoryProduct, sortedProduct } from '../ultil/get-sort-product';
import { IPagination } from '../ultil/interface/pagination.interface';
import { IProductMapping } from '../ultil/interface/product-mapping.interface';
import { updateNestedObjectParse } from '../ultil/update-nested-object';

export class ElasticsearchService {
  static async searchProduct(keyword: string, pagination: IPagination) {
    const { limit, page } = pagination;
    const offset = (page - 1) * limit;
    try {
      const response = await client.search({
        index: PRODUCT_IDX,
        body: {
          from: offset,
          size: limit,
          query: {
            bool: {
              should: [
                {
                  match: {
                    product_name: {
                      query: keyword,
                      boost: 3,
                      fuzziness: 2,
                    },
                  },
                },
                {
                  match: {
                    product_type: {
                      query: keyword,
                      boost: 1,
                      fuzziness: 2,
                    },
                  },
                },
                {
                  match: {
                    'product_shop.name': {
                      query: keyword,
                      boost: 2,
                      fuzziness: 2,
                    },
                  },
                },
              ],
              must: {
                match: {
                  isPublished: true,
                },
              },
            },
          },
        },
      });

      const products = response.hits.hits;
      const total = response.hits.total;
      return {
        products,
        pagination: {
          ...pagination,
          total,
        },
      };
    } catch (err) {
      console.log('err performing full-text search:', err);
    }
  }

  static async suggestSearch(keyword: string) {
    const shopSuggestionP = client.search({
      index: PRODUCT_IDX,
      body: {
        query: {
          match: {
            'product_shop.name': {
              query: keyword,
              minimum_should_match: '75%',
            },
          },
        },
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 5,
      },
    });

    const productSuggestionP = client.search({
      index: PRODUCT_IDX,
      body: {
        suggest: {
          suggest_product: {
            prefix: keyword,
            completion: {
              field: 'product_name.suggest',
              fuzzy: {
                fuzziness: 'auto',
              },
            },
          },
        },
        query: {
          match: {
            isPublished: true,
          },
        },
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 5,
      },
    });

    const [shopSuggestion, productSuggestion] = await Promise.all([
      shopSuggestionP,
      productSuggestionP,
    ]);

    return {
      product: productSuggestion.suggest?.suggest_product,
      shop: shopSuggestion,
    };
  }

  static async categoryProduct(
    type: string,
    keyword: string,
    pagination: IPagination
  ) {
    return await categoryProduct(type, keyword, pagination);
  }

  static async sortedProductBy(
    sortedBy: string,
    type: string,
    keyword: string,
    pagination: IPagination
  ) {
    const sortedProductFunc = sortedProduct[sortedBy];
    if (!sortedProductFunc) throw new BadRequest('Category not found!');
    return sortedProductFunc(type, keyword, pagination);
  }

  static async createProduct(payload: IProductMapping): Promise<void> {
    try {
      await client.index({
        index: PRODUCT_IDX,
        id: payload.id,
        body: payload,
      });
    } catch (err) {
      console.log('err creating product:', err);
    }
  }

  static async updateProduct(payload: IProductMapping): Promise<void> {
    const { id: productId, ...data } = payload;
    const updateData = updateNestedObjectParse(data);
    try {
      await client.update({
        index: PRODUCT_IDX,
        id: productId,
        body: {
          doc: updateData,
        },
      });
    } catch (err) {
      console.log('err update product:', err);
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      await client.delete({
        index: PRODUCT_IDX,
        id: productId,
      });
    } catch (err) {
      console.log('err update product:', err);
      throw err;
    }
  }
}
