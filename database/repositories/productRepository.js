import { ProductDAO } from "../data access objects/product-dao";

export class ProductRepository extends ProductDAO {
    
    async findProductAndUpdateStock(product, productId) {
        await this.addProduct(product)
        await this.updateStock(productId);
    }
}