import jwt from "jsonwebtoken";

const PRIVATE_KEY = "myprivatekey";

const jwtManager = {
    generateAuthToken: (user) => {
        const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '60000s' });
        return token;
    },

    auth: (token) => {

        try {
            const originalUserData = jwt.verify(token, PRIVATE_KEY);
            return originalUserData
          } catch (ex) {
            return res.status(403).json({
              error: 'token invalido',
              detalle: 'nivel de acceso insuficiente para el recurso solicitado'
            })
          }
    }
}

export default jwtManager;