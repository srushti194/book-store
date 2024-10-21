const bookModel = require("../models/booksModel");
const bookTransform = require("../transformer/bookTransformer")

exports.listBooks = async (req, res) => {
  try {
    let reqBody = req.body;
    let limit = reqBody?.limit ?? 10;
    let page = reqBody?.page ?? 1;
    page = (page - 1) * limit;

    // For get the books data from db and add pagination
    let bookList = await bookModel.findAll({ where: { isDeleted: false } , offset: page, limit: limit});

    let response = await bookTransform.transformBookDetails(bookList)

    return res.status(200).send({statusCode: 200, message: "Book list found successfully", data: response})
  } catch (e) {
    return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
  }
};

exports.viewBook = async (req, res) => {
    try {
        let {id} = req.params;

        let bookDetails = await bookModel.findOne({where: {id: id, isDeleted: false}});
        if (!bookDetails) return res.status(404).send({statusCode: 404, message: "Book not found"})

        let response = await bookTransform.transformViewBookDetails(bookDetails)

        return res.status(200).send({statusCode: 200, message: "Book details found successfully", data: response})
    } catch (e) {
        return res.status(500).send({ statusCode: 500, message: "Something went wrong" });
    }
}