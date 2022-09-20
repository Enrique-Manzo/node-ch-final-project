import passport from "passport";

export const registrationController = passport.authenticate('registration', {
    successRedirect: '/profile',
    failureRedirect: '/auth/failRegister',
})

export const loginController = passport.authenticate('login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
})

export function successRegisterController(req, res) {
    res.json(req.user)
    // res.sendFile('registroOk.html', { root: './views' })
}

export function failRegisterController(req, res) {
    res.status(400).json({ err: 'fallo el registro' })
}

export function successLoginController(req, res) {
    res.json({ msg: 'ok' })
}

export function failLoginController(req, res) {
    res.status(401).json({ err: 'fallo el login' })
}


export function logoutController(req, res) {
    if (req.isAuthenticated()) {
        req.logout()
    }
    res.sendStatus(200)
} 