const cartModel = require("../models/cartModel")
const orderModel = require("../models/orderModel")
const booksModel = require("../models/booksModel")
const orderItemModel = require("../models/orderItemModel")
const {placeOrderValidation} = require("../validation/orderValidation")

exports.placeOrder = async (req, res) => {
    try {
        let reqBody = req.body;
        let userId = req.user.id
        let orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Create custom order number

        // For validate request
        const {error} = placeOrderValidation.validate(reqBody);
		if (error) return res.status(400).send({statusCode: 400, message: `${error.details.map((elem) => elem.message).join(",")}`});

        // To check cart id exists or not
        let cartFound = await cartModel.findOne({where: {id: reqBody.cartId}});
        if (!cartFound) return res.status(404).send({statusCode: 404, message: "Cart not found"});

        // To check book id is exists or not
        let bookFound = await booksModel.findOne({where: {id: cartFound.bookId, isDeleted: false}});
        if (!bookFound) return res.status(404).send({statusCode: 404, message: "Book not found"})

        let totalAmount = bookFound.price * cartFound.quantity

        let orderData = await orderModel.create({userId: userId, paymentType: reqBody.paymentType, orderNumber: orderNumber});
        await orderItemModel.create({orderId: orderData.id, userId: userId, bookId: cartFound.bookId, quantity: cartFound.quantity, totalAmount: totalAmount})

        return res.status(200).send({statusCode: 200, message: "Order placed successfully"});
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

        // Query for get the order, book and order item data
        let orderData = await orderItemModel.findAll({
            where: { userId: userId },
            include: [
                {
                    model: orderModel,
                    attributes: ['id', 'paymentType', 'orderNumber', 'createdAt'],
                    
                },
                {
                    model: booksModel,
                    attributes: ['id', 'title', 'description', 'price'],
                    
                }
            ],
            offset: page,
            limit: limit
        });
        
        return res.status(200).send({statusCode: 200, message: "Order history found successfully", data: orderData});
    } catch (e) {
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}

exports.view = async (req, res) => {
    try {
        let {id} = req.params;
        let userId = req.user.id

        // Query for get the order, book and order item data
        let orderData = await orderItemModel.findOne({
            where: { userId: userId, orderId: id },
            include: [
                {
                    model: orderModel,
                    attributes: ['id', 'paymentType', 'orderNumber', 'createdAt'],
                    
                },
                {
                    model: booksModel,
                    attributes: ['id', 'title', 'description', 'price'],
                    
                }
            ]
        });
        return res.status(200).send({statusCode: 200, message: "Order details found successfully", data: orderData});
    } catch (e) {
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}