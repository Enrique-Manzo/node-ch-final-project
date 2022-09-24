const adminChecker = {
    idAdmin: (req, res, next) => {       
        req.userData?.user?.email === "admin@admin.com" ? next() : res.status(400).json({"message": "You are not allowed to access this resource"})
    }
}

export default adminChecker;