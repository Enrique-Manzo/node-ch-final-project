import passport from "passport";
import { Strategy } from "passport-local";
import database from "../../database/contenedores/contenedorMongoDB.js";
import bcrypt from "bcrypt";
import {mail} from "../../communication/emails/sendgridConfig.js";

const ADMIN_EMAIL = "enq.manzo@gmail.com";

async function registrarUsuario(datos) {
    
    bcrypt.hash(datos.password, 10, function(err, hash) {
        datos.password = hash;
      });

    datos.id = new Date().getTime();
    datos.carts = [];
    
    const msg = {
        to: ADMIN_EMAIL,
        from: ADMIN_EMAIL,
        subject: 'Nuevo registro',
        text: 'Nuevo registro de usuario',
        html: `<ul>
                    <li>Nombre: ${datos.fname}</li>
                    <li>Apellido: ${datos.lname}</li>
                    <li>Username: ${datos.username}</li>
                    <li>Address: ${datos.address}</li>
                    <li>Phone number: ${datos.phoneNo}</li>
                    <li>Age: ${datos.age}</li>
                </ul>`,
    };

    mail.send(msg);

    const user = await database.insertObject("ecommerce", "users", datos)

    return user
}


passport.use("registration", new Strategy(
    {
        passReqToCallback: true,
        // usernameField: 'email',
        // passwordField: 'contrasenia',
    },

    async (req, username, password, done) => {
        
        try {
            const datosUsuario = req.body
            const usuario = await registrarUsuario(datosUsuario)

            done(null, usuario)
            // done(null, usuario, info) // donde info es un objeto, opcional
        } catch (error) {
            done(error)
            // done(error, null, info) // donde info es un objeto, opcional
        }
    })
);

passport.use("login", new Strategy(
    async (username, password, done) => {
        
        const user = await database.findByUsername("ecommerce", "users", username)
        
        if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
                console.log(user.password)
                console.log(result)
                if (result) { console.log("wrong password"); console.log(user); done(null, user) }
                })
            } else {
                console.log("wrong password")
                done(null, false)
            }
    }
))

export const passportMiddleware = passport.initialize();

passport.serializeUser(async function(user, done) {
    
    const userObject = await user;
    done(null, userObject);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });  

export const passportSessionHandler = passport.session()