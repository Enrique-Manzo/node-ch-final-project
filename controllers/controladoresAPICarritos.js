import CartManager from "../database/data access objects/carts-dao.js";
import ProductManager from "../database/data access objects/product-dao.js";
import SaleManager from "../database/data access objects/sale-dao.js";
import Cart, { Sale } from "../business/business.js";

const ADMIN_EMAIL = "enq.manzo@gmail.com";

const controladoresAPICarrito = {
    
    getUserId: (req, res) => {
        if (req.session?.passport?.user == undefined) {
            res.status(500).json({"error": "please log in"})
        }

        res.json({
            "user_id": req.session.passport.user.id,
            "username": req.session.passport.user.username,
        })
    },

    postProductToCart: async (req, res) => {
        const userId = req.body.user_id;
        const productId = parseFloat(req.body.product_id);

        const product = await ProductManager.findProductById(productId);
      
        try {
            Cart.addProductToCart(userId, product)

            res.json({"message": "success"})
            
        } catch(err) {
            res.json({"error": err.message})
        }
    },

    postFinishPurchase: async (req, res) => {
       
        const cartId = req.body.cartId;
        const userId = req.body.userId

        try {
            const cart = await CartManager.findActiveCartsByUserId(userId);
            const user = await database.readById("ecommerce", "users", parseFloat(userId));
            
            const msg = {
                to: ADMIN_EMAIL,
                from: ADMIN_EMAIL,
                subject: `Nuevo pedido de ${user.fname} | ${user.username}`,
                text: `Nuevo pedido`,
                html: `<ul>
                            ${cart.products.map(product => {return "<li>" + product.name + " | " + product.price + "</li>"})}
                        </ul>`,
            };
        
            mail.send(msg);

            await CartManager.closeOpenCartById(cartId)

            const client = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN)

            const options = {
                body: `Your purchase has been received and it's being processed. You cart id is ${cart.id}`,
                from: "+19592071608",
                to: "+34627276291" // esto se le enviaría a un usuario, pero la cuenta de prueba de Twilio no lo permite
            };

            await client.messages.create(options);

            client.messages.create({ 
                body: `Nuevo pedido de ${user.fname} | ${user.username}`, 
                from: 'whatsapp:+14155238886',       
                to: 'whatsapp:+5492245423083' 
            }) 
            .then(message => console.log(message.sid))

            const sale = new Sale(cart);

            const saleData = sale.getSaleData();

            SaleManager.postSale(saleData);
            
            for (let productSale in cart.products) {
                sale.updateStock(productSale.id)
            }

            res.status(200).json({"message": "success"})

        } catch(error) {
            console.log(error)
        }

        
    },

    deleteCartProduct: (req, res) => {
        return
    }
};

export default controladoresAPICarrito;