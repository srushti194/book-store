const bookModel = require("./models/booksModel")

// Script to add book data
const bookData = async () => {
    const data = [{
        title: "book 1",
        description: "book des",
        price: 2500,
        stock: 20,
        isDeleted: false
    },
    {
        title: "book 2",
        description: "book des",
        price: 1500,
        stock: 200,
        isDeleted: false
    },
    {
        title: "book 3",
        description: "book des",
        price: 500,
        stock: 50,
        isDeleted: false
    }]
    for (let a of data) {
        await bookModel.create(a)
    }
}
bookData()