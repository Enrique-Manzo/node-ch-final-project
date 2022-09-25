import jwtManager from "../middlewares/authentication/jwt.js";
import { User } from "../business/business.js";
import UserManager from "../database/data access objects/users-dao.js";
import bcrypt from "bcrypt";

const ControladorAutorizacion = {
    auth: (req, res, next) => {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"] || '';

        if (!authHeader) {
            return res.status(401).json({
            error: 'se requiere autenticacion para acceder a este recurso',
            detalle: 'no se encontró token de autenticación'
            })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
            error: 'se requiere autenticacion para acceder a este recurso',
            detalle: 'formato de token invalido!'
            })
        }

        try {
            const originalUserData = jwtManager.auth(token)
            req.userData = originalUserData
          } catch (ex) {
            return res.status(403).json({
              error: 'token invalido',
              detalle: 'nivel de acceso insuficiente para el recurso solicitado'
            })
          }
        
          next();


    },

    registerUser: async (req, res) => {
        try {
            const userData = req.body
            const user = new User(userData)

            const userEmail = user.email

            const userExists = await UserManager.getByEmail(userEmail)

            if (userExists.email) {
                return res.status(400).json({ "error": 'A user with that email address already exists' });
            }

            bcrypt.hash(user.password, 10, async function(err, hash) {
                user.password = hash;

                await UserManager.addUser(user.data())
    
                const access_token = jwtManager.generateAuthToken(user.data());
    
                res.status(200).json({"message": "User added successfully", "token": {access_token}})

              });
            

        } catch(err) {
            res.json({"message": err.message})
        }

    },

    loginUser: async (req, res) => {
        try {
            const userEmail = req.body.email
            const userPassword = req.body.password

            const userExists = await UserManager.getByEmail(userEmail)

            if (!userExists) {
                return res.status(400).json({ "error": 'A user with that email address already exists' });
            }

            bcrypt.compare(userPassword, userExists.password, function(err, result) {
                if (result) { 
                    console.log("password correct");
                    console.log(userExists);
                    const access_token = jwtManager.generateAuthToken(userExists)
                    res.json({access_token})
                }
                else {
                    res.status(400).json({"error": "Wrong email address or password"}) // Pero lo que falló es el password
                }
            })

        } catch(err) {
            res.json({"error": err.message})
        }
    }
}

export default ControladorAutorizacion;