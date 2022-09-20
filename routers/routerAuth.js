import Router from "express";
import {registrationController, loginController, 
        logoutController,
        successRegisterController,
        failRegisterController,
        successLoginController,
        failLoginController } from "../controllers/controladoresAuthentication.js";
import multer from "multer";

const routerAuth = new Router()

// MULTER

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            const nombreFinal = `${new Date().toISOString().split('T')[0]}-profile-${file.originalname}`.replace(/ /g, '');
            cb(null, nombreFinal)
        }
    })
    
    const upload = multer({ storage })
    
    const singleFileMulter = upload.single('profile_picture')

// REGISTER
routerAuth.post("/register", registrationController);
routerAuth.post("/registerImage", singleFileMulter);
routerAuth.post("/failRegister", failRegisterController);
routerAuth.post("/successRegister", successRegisterController)


// LOGIN
routerAuth.post("/login", loginController);
routerAuth.get("/failLogin", failLoginController);
routerAuth.get("/successLogin", successLoginController);


// LOGOUT
routerAuth.get("/logout", logoutController);



export default routerAuth;
