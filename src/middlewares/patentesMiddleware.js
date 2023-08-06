const validarPageLimit = (request, response, next) => {
    let {page, limit} = request.query;

    if(page && limit) {
        if(page < 1) {
            return response.status(400).json({message: "The page cannot be smaller than 1!"});
        }
        if(limit < 1) {
            return response.status(400).json({message: "The limit cannot be smaller than 1!"});
        }
    }
    next();
};

module.exports = {
    validarPageLimit
};