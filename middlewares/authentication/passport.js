import passport from "passport";
import { Strategy } from "passport-local";
import database from "../../database/contenedores/contenedorMongoDB.js";
import bcrypt from "bcrypt";

const ADMIN_EMAIL = "enq.manzo@gmail.com";

async function registrarUsuario(datos) {
    
    bcrypt.hash(datos.password, 10, function(err, hash) {
        datos.password = hash;
      });

    datos.id = new Date().getTime();
    datos.carts = [];
    
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