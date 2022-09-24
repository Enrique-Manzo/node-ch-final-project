import DataAccessObject from "../database/factories/daoFactory.js";
import { v4 } from "uuid";
import CartManager from "../database/data access objects/carts-dao.js";
import OrderManager from "../database/data access objects/orders-dao.js";
import nodemailer from 'nodemailer';

class Product {
    #name
    #description
    #price
    #image

    constructor({name, description, price, image}) {
        this.id = v4(),
        this.name = name,
        this.description = description,
        this.price = price,
        this.image = image
    }

    set name(value) {
        if (!value) throw new Error('Name is a required field')
        if (typeof value !== 'string') throw new Error('The name must be a string');
        this.#name = value
    }

    get name() { return this.#name }

    set description(value) {
        if (!value) throw new Error('Description is a required field')
        if (typeof value !== 'string') throw new Error('The description must be a string');
        this.#description = value
    }

    get description() { return this.#description }

    set price(value) {
        if (!value) throw new Error('Price is a required field')
        if (isNaN(value)) throw new Error('Price must be a number')
        if (valor <= 0) throw new Error('Price must be higher than 0')
        this.#price = value
    }

    get price() { return this.#price }

    set image(value) {
        if (!value) throw new Error('Image is a required field')
        if (typeof value !== 'string') throw new Error('The image must be a string');
        this.#image = value
    }

    get image() { return this.#image }

    data() {
        return {
            id: this.id,
            name: this.#name,
            description: this.#description,
            price: this.#price,
            image: this.#image,
        }
    }

}

class Cart {

    constructor(id) {
        this.id = id
        this.products = []
    }

    async addProductToCart(userId, product) {
      
        if (!product) {
            throw new Error({"message": "You must provide a product to add"})
        }

        const cart = await CartManager.findCartById(userId);
        
        if (!cart) {
            try {
                const newCart = new Cart(userId)

                product.amount = 1

                newCart.products.push(product)
    
                await CartManager.postNewCart(newCart)
    
                return {"success": "Product successfully added to cart"}
            } catch(err) {
                return {"error": err.message}
            }
            
        }

        const productExists = await CartManager.findProductById(userId, product.id)
       
        if (!productExists) {
            try {
                product.amount = 1;
                await CartManager.updateCartProductList(userId, product)
                
                return {"success": "Product successfully added to cart"}
            } catch(err) {
                return {"error": err.message}
            }
        }

        try {
            await CartManager.increaseProductAmount(userId, product.id)
            return {"success": "Another product of the same type successfully added to cart"}
        } catch(err) {
            return {"error": err.message}
        }
        
    }
}

class Order {

    #clientId
    #products

    constructor(clientId, cart) {
        this.id = v4(),
        this.date = new Date().toLocaleString(),
        this.clientId = clientId,
        this.products = cart.products
    }

    async submitOrder(order) {

        try {
            await OrderManager.insertNewOrder(Object.assign({}, order));

            await CartManager.deleteAllProductsFromCart(this.clientId);

            return {"success": "A new order has been posted"}

        } catch(err) {
            return {"error": err.message}
        }    
    }

    async notifyUserAndAdmin() {
        try {
            // Generate test SMTP service account from ethereal.email
            // Only needed if you don't have a real mail account for testing
            const testAccount = await nodemailer.createTestAccount();

            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
                },
            });
            console.log(testAccount.user)
            // send mail with defined transport object
            const info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "enq.manzo@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });

            console.log(info)
        } catch(err) {

        }
    }

    set products(value) {
        if (!value) throw new Error('A cart is required')
        if (value.length <= 0) throw new Error('There must be at least one product in the cart')
        this.#products = value
    }

    get products() { return this.#products }

    set clientId(value) {
        if (!value) throw new Error('A client ID is required')
        this.#clientId = value
    }

    get clientId() { return this.#clientId }

    data() {
        return Object.freeze({
            id: this.id,
            date: this.date,
            clientId: this.#clientId,
            products: this.#products
        })
    }

}

class User {

    #email
    #password
    #name
    #lastName
    #phone
    #image

    constructor({email, password, name, lastName, phone, image}) {
        this.id = v4(),
        this.email = email,
        this.password = password,
        this.name = name,
        this.lastName = lastName,
        this.phone = phone,
        this.image = image
    }

    set email(value) {
        if (!value) throw new Error('You must specify an email address');
        if (typeof value !== 'string') throw new Error('The email address must be a string');
        if (!value.includes('@')) throw new Error('Invalid email address format')

        this.#email = value
    }

    get email() {return this.#email}

    set password(value) {
        if (!value) throw new Error('You must specify a password');
        if (typeof value !== 'string') throw new Error('The password must be a string');

        this.#password = value
    }

    get password() {return this.#password}

    set name(value) {
        if (!value) throw new Error('You must specify your last name');
        if (typeof value !== 'string') throw new Error('Your name address must be a string');
        if (/\d/.test(value)) throw new Error('Invalid name format') // checks whether the name contains a number

        this.#name = value
    }

    get name() {return this.#name}

    set lastName(value) {
        if (!value) throw new Error('You must specify your last name');
        if (typeof value !== 'string') throw new Error('Your last name address must be a string');
        if (/\d/.test(value)) throw new Error('Invalid last name format') // checks whether the last name contains a number

        this.#lastName = value
    }

    get lastName() {return this.#lastName}

    set phone(value) {
        if (!value) throw new Error('You must specify a phone number');
        if (typeof value !== 'string') throw new Error('Your phone number must be a string');
        if (/[a-zA-Z]/.test(value)) throw new Error('Invalid phone number format') // checks whether the phone number contains a letter

        this.#phone = value
    }

    get phone() {return this.#phone}

    set image(value) {
        if (!value) throw new Error('You must specify an image url');
        if (typeof value !== 'string') throw new Error('Your image url must be a string');

        this.#image = value
    }

    get image() {return this.#image}

    data() {
        return {
            id: this.id,
            email: this.#email,
            password: this.#password,
            name: this.#name,
            lastName: this.#lastName,
            phone: this.#phone,
            image: this.#image
        }
    }


}

export {Product};
export {Cart};
export {Order};
export {User};