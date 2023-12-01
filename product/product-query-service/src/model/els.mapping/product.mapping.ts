import { PRODUCT_IDX } from '../../constant/els.constant';
import client from '../../dbs/init.elastic';

export async function createIndexWithMapping() {
  try {
    // Create the index with the specified mapping
    await client.indices.create({
      index: PRODUCT_IDX,
      body: {
        mappings: {
          dynamic: 'strict',
          properties: {
            id: { type: 'keyword' }, // Define your custom _id field here
            product_name: {
              type: 'text', // For full-text search
              fields: {
                suggest: {
                  type: 'completion', // For autocomplete
                },
              },
              analyzer: 'english',
            },
            product_thumb: { type: 'text', index: false },
            product_price: { type: 'double' },
            product_type: { type: 'text' },
            product_shop: {
              properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
              },
            },
            product_sale_number: { type: 'long', index: false },
            product_ratingAverage: { type: 'double' },
            isDraft: { type: 'boolean', index: false },
            isPublished: { type: 'boolean', index: false },
            product_images: { type: 'text', index: false },
            createdAt: { type: 'date', index: false },
            updatedAt: { type: 'date', index: false },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

export async function updateMapping() {
  try {
    await client.indices.putMapping({
      index: PRODUCT_IDX,
      body: {
        properties: {
          id: { type: 'keyword' }, // Define your custom _id field here
          product_name: {
            type: 'text', // For full-text search
            fields: {
              suggest: {
                type: 'completion', // For autocomplete
              },
            },
            analyzer: 'english',
          },
          product_thumb: { type: 'text', index: false },
          product_price: { type: 'double' },
          product_type: { type: 'text' },
          product_shop: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text' },
            },
          },
          product_sale_number: { type: 'long', index: false },
          product_ratingAverage: { type: 'double' },
          isDraft: { type: 'boolean', index: false },
          isPublished: { type: 'boolean', index: false },
          product_images: { type: 'text', index: false },
          createdAt: { type: 'date', index: false },
          updatedAt: { type: 'date', index: false },
        },
      },
    });

    console.log('Index mapping updated successfully');
  } catch (error) {
    console.error('Error updating index mapping:', error);
  }
}
