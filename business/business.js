import DataAccessObject from "../database/factories/daoFactory.js";

class Product {
    #itemId
    #price
    #stock

    constructor({itemId, price, stock}) {
        this.itemId = itemId,
        this.price = price,
        this.stock = stock
    }

    set itemId(value) {
        if (!value) throw new Error('You must specify an Item ID');
        if (typeof value !== 'int') throw new Error('The Item ID must be a string');

        this.#itemId = value
    }

    get itemId() {return this.#itemId}

    set price(value) {
        if (!value) throw new Error('Price is a required field')
        if (isNaN(value)) throw new Error('Price must be a number')
        if (valor <= 0) throw new Error('Price must be higher than 0')
        this.#price = value
    }

    get price() { return this.#price }

    set stock(value) {
        if (!value) throw new Error('Stock is a required field')
        if (isNaN(value)) throw new Error('Stock must be a number')
        if (value <= 0) throw new Error('Stock must be higher than 0')
        this.#stock = value
    }

    get stock() { return this.#stock }

    data() {
        return Object.freeze({
            itemId: this.#itemId,
            price: this.#price,
            stock: this.#stock,
        })
    }

}

const Cart = {

    async createNewCart(userId) {
        // verifies whether there is a cart open already.
        // Returns new Cart object.
        const cartManager = new DataAccessObject("cart");

        const cart = await CartManager.findActiveCartsByUserId(userId);

        if (!cart) {
            const newCart = {
                id: Math.random().toString(36).substring(2, 9),
                owner_id: userId.toString(),
                date: new Date(),
                products: [],
                status:"open"
            }

            await CartManager.postNewCartToUser(newCart)

            return newCart;
        } else {
            throw new Error({"message": "This user already has an open cart"})
        }
        
    },

    async addProductToCart(userId, product) {
       
        // verifies that the product hasn't been added before, if it has, it increases the amount.
        // Returns product in cart-like format

        if (!product) {
            throw new Error({"message": "no product was passed to this function"})
        }

        const cartManager = new DataAccessObject("cart");
        const cart = await CartManager.findActiveCartsByUserId(userId);

        const invoiceableProduct = {};

        invoiceableProduct.id = product.id;
        invoiceableProduct.name = product.name;
        invoiceableProduct.price = product.price;
        invoiceableProduct.image = product.image;
        invoiceableProduct.amount = 1;
        
        if (cart) {
            if (cart.products.length > 0) {
                for (let cartProduct of cart.products) {
                    if (cartProduct.id == invoiceableProduct.id) {
                        cartProduct.amount++
                    }
                }

                if (!cart.products.some((e)=> { return e.id == invoiceableProduct.id})) {
                    cart.products.push(invoiceableProduct)
                }

            } else {
                    cart.products.push(invoiceableProduct)
                }

            await CartManager.updateCartProductList(cart.id, cart.products);

        } else {
            this.createNewCart(userId)
            this.addProductToCart(userId, invoiceableProduct)
        }
    }
}

class Sale {

    #cart

    constructor({cart}) {
        this.cart = cart
    }

    getSaleData() {
        // returns sale-specific data

        const sale = {};

        sale.products = this.#cart.products;

        for (product of this.#cart.products) {
            sale.totalAmount =+ cart.amount;
        }

        sale.date = new Date().toLocaleDateString;
        

        return sale;
    }

    async postSale(dtoSale) {
        const saleManager = new DataAccessObject("sale");

        await saleManager.postSale(dtoSale)

        return dtoSale
    }

    async updateStock(productId) {
        // connects to db to update the stock in the specified amount
        await ProductManager.updateStock(productId)

    }

    set cart(value) {
        if (!value) throw new Error('A cart is required')
        if (value.length <= 0) throw new Error('There must be at least one cart in a sale')
        this.#cart = value
    }

    get cart() { return this.#cart }

}

export {Product};
export default Cart;
export {Sale};