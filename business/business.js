import DataTransferObject from "../database/data transfer objects/dtos.js";
import { v4 } from "uuid";
import CartManager from "../database/data access objects/carts-dao.js";
import OrderManager from "../database/data access objects/orders-dao.js";
import UserManager from "../database/data access objects/users-dao.js";
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
        if (value <= 0) throw new Error('Price must be higher than 0')
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

    // Agrega un producto al carrito
    async addProductToCart(userId, product) {
      
        // Controla que se brinde un producto
        if (!product) {
            throw new Error("You must provide a product to add")
        }

        const cart = await CartManager.findCartById(userId);
        
        // Si no existe un carrito, crea uno y prepara el producto para ingresarlo
        if (!cart) {
            try {
                const newCart = new Cart(userId)

                const productDTO = new DataTransferObject("product", product)

                productDTO.dto.amount = 1

                newCart.products.push(productDTO.dto)

                await CartManager.postNewCart(newCart)
    
                return {"success": "Product successfully added to cart"}
            } catch(err) {
                return {"error": err.message}
            }
            
        }

        const productExists = await CartManager.findProductById(userId, product.id)
       
        // Si no existe el producto en el carrito todavía, lo prepara y inserta
        if (!productExists) {
            try {
                const productDTO = new DataTransferObject("product", product)
                productDTO.dto.amount = 1;
                await CartManager.updateCartProductList(userId, productDTO.dto)
                
                return {"success": "Product successfully added to cart"}
            } catch(err) {
                return {"error": err.message}
            }
        }

        // Aumenta la cantidad del producto ya existente
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

    // Guarda la orden en la base de datos
    async submitOrder(order) {

        try {
            // Object.assing para obtener los campos frizados
            await OrderManager.insertNewOrder(Object.assign({}, order));

            await CartManager.deleteAllProductsFromCart(this.clientId);

            return {"success": "A new order has been posted"}

        } catch(err) {
            return {"error": err.message}
        }    
    }

    async notifyUserAndAdmin(order) {

        try {

            const user = await UserManager.findUserById(order.clientId)

            // Create el transporter de nodemailer - hecho con sendinblue (Gmail ya no acepta con solo email y pass)
            const transporter = nodemailer.createTransport({
                host: 'smtp-relay.sendinblue.com',
                port: 587,
                auth: {
                    user: 'enq.manzo@gmail.com',
                    pass: process.env.EMAIL_SENDINBLUE_PASS
                }
            });

            const plainText = 
            `
            A new purchase order with the following information has been placed\n
            \n
            Date: ${order.date}
            Products:\n
            ${order.products.map(product => `${product.name} | $${product.price} | Amount: ${product.amount}\n`)}
            \n
            User: ${user.name} ${user.lastName}, ${user.email}

            Total: $${order.products.reduce((accumulator, object) => {
                const final = object.amount * parseInt(object.price)
                return accumulator + final;
              }, 0)}
            `
           
            const HTMLText =
            `
            <h1>A new purchase order with the following information has been placed</h1>
            
            <p>Date: ${order.date}</p>
            <p>Products:</p>
            <ul>
            ${order.products.map(product => `<li>${product.name} | $${product.price} | Amount: ${product.amount}</li>`)}
            </ul>
            <p>User: ${user.name} ${user.lastName}, ${user.email}</p>

            <p><b>Total: $${order.products.reduce((accumulator, object) => {
                const final = object.amount * parseInt(object.price)
                return accumulator + final;
              }, 0)}
            </p></b>
            `

            // envía el mail al admin con el detalle de la compra
            await transporter.sendMail({
                from: '"System admin" <enq.manzo@gmail.com>', // sender address
                to: "enq.manzo@gmail.com", // list of receivers
                subject: "New purchase order placed", // Subject line
                text: plainText, // plain text body
                html: HTMLText, // html body
            });

            // envía el mail al usuario con el detalle de la compra
            await transporter.sendMail({
                from: '"New purchase order placed" <enq.manzo@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "New purchase order placed", // Subject line
                text: plainText, // plain text body
                html: HTMLText, // html body
            });


        } catch(err) {
            return {"error": err.message}
        }
    }

    set products(value) {
        if (!value) throw new Error('A cart is required')
        if (value.length <= 0) throw new Error('There must be at least one product in the cart.')
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