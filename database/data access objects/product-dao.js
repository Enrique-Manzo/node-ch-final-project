import database from "../contenedores/contenedorMongoDB.js";

export class ProductDAO {

    // GETS
    async getAllProducts () {

        const allProducts = await database.readAll("ecommerce", "products");
        
        return allProducts;
    }

    async getRandomProduct() {
        
        const randomProduct = await database.findRandom("ecommerce", "products");

        return randomProduct        

    }

    async findProductById(productId) {
        const product = await database.readByAlfaNumId("ecommerce", "products", productId);

        return product;
    }

    // ADDS

    async addProduct(product) {
        const response = await database.insertObject("ecommerce", "products", product)
        
        if (response.insertedId) {
            return {"success": "Inserted", "code": 1}
        } else {
            return {"error": "Not inserted", "code": 0}
        }
        
    }

    // UPDATE

    async updateStock(productId) {
        database.updateOne("ecommerce", "products", {id: productId}, {stock: {$subtract: ["stock", 1]}})
    }
    
    async updateById(productId, data) {
        try {
            const response = await database.updateOne("ecommerce", "products", {id: productId}, data)

            return response
        } catch (err) {
           return {"error": err.message}
        }

    }

    // DELETE
    async deleteById(productId) {
        try {
            const response = await database.deleteOne("ecommerce", "products", {id: productId})
            return response
        } catch (err) {
            return err
        }
        
        
    }
}

const ProductManager = new ProductDAO();

export default ProductManager;