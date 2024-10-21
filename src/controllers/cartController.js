const cartModel = require("../models/cartModel");
const bookModel = require("../models/booksModel")
const {addCartValidation} = require("../validation/cartValidation")

exports.add = async (req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.user.id

        // For request validation
        const {error} = addCartValidation.validate(reqBody);
		if (error) return res.status(400).send({statusCode: 400, message: `${error.details.map((elem) => elem.message).join(",")}`});

        // To check book id is correct or not
        let bookFound = await bookModel.findOne({where: {id: reqBody.bookId, isDeleted: false}})
        if (!bookFound) return res.status(404).send({statusCode: 404, message: "Book not found"})

        let cartData = await cartModel.create({userId: userId, bookId: reqBody.bookId, quantity: reqBody.quantity});

        return res.status(200).send({statusCode: 200, message: "Item added in to cart successfully", data: cartData});
    } catch (e) {
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

exports.list = async (req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.user.id
        let limit = reqBody?.limit ?? 10;
        let page = reqBody?.page ?? 1;
        page = (page - 1) * limit;

        let cartList = await cartModel.findAll({ where: {userId: userId } , offset: page, limit: limit});

        return res.status(200).send({statusCode: 200, message: "Cart details found successfully", data: cartList});
    } catch (e) {
        console.log(e);
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

exports.delete = async (req, res) => {
    try {
        let {id} = req.params;

        await cartModel.destroy({where: {id: id}});

        return res.status(200).send({statusCode: 200, message: "Cart deleted successfully"});
    } catch (e) {
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}