import jwt from "jsonwebtoken";

const PRIVATE_KEY = "myprivatekey";

const jwtManager = {
    generateAuthToken: (user) => {
        const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '600s' });
        return token;
    },

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
            const originalUserData = jwt.verify(token, PRIVATE_KEY);
            req.userData = originalUserData
          } catch (ex) {
            return res.status(403).json({
              error: 'token invalido',
              detalle: 'nivel de acceso insuficiente para el recurso solicitado'
            })
          }
        
          next();


    }
}

export default jwtManager;