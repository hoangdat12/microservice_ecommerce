import { NextFunction, Request, Response } from 'express';
import { OK } from '../core/success.response';
import ProductFactory from '../service/product.service';
import { getPaginationData } from '../ultil/get-pagination';
import { ElasticsearchService } from '../service/els.service';

export class ProductQuery {
  static async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await ProductFactory.getProductDetail(productId);
      return new OK(product).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = getPaginationData(req.query);
      return new OK(await ProductFactory.getProducts(pagination)).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async findAllDraftForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shopId } = req.params;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ProductFactory.findAllDraftForShop(shopId, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async findAllPublishForShop(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shopId } = req.params;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ProductFactory.findAllPublishForShop(shopId, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async searchProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword: string = req.query.s as unknown as string;
      const pagination = getPaginationData(req.query);
      if (!keyword) return new OK([]);
      return new OK(
        await ElasticsearchService.searchProduct(keyword, pagination)
      ).send(res);
    } catch (error) {
      next(error);
    }
  }

  static async suggestSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword: string = req.query.s as unknown as string;
      if (!keyword) return new OK([]);
      return new OK(await ElasticsearchService.suggestSearch(keyword)).send(
        res
      );
    } catch (err) {
      next(err);
    }
  }

  static async categoryProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const keyword = req.query.keyword as string;
      const category = req.query.category as string;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ElasticsearchService.categoryProduct(
          category,
          keyword,
          pagination
        )
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async sortedProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = req.query.keyword as string;
      const category = req.query.category as string;
      const sortedBy = req.query.sortedBy as string;
      const pagination = getPaginationData(req.query);
      return new OK(
        await ElasticsearchService.sortedProductBy(
          sortedBy,
          category,
          keyword,
          pagination
        )
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}
