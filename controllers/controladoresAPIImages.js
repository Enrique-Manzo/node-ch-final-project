const ControladorImages = {
    postImage: (req, res) => {
        res.status(200).send({"url": req.url})
    }
}

export default ControladorImages;