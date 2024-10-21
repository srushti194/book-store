exports.bookTransform = (data) => {
  return {
    bookId: data?.id ? data.id : "",
    title: data?.title ? data.title : "",
    description: data?.description ? data.description : "",
    price: data?.price ? data.price : 0,
    stock: data?.stock ? data.stock : 0,
    isDeleted: data?.isDeleted ? data.isDeleted : false,
  };
};

exports.transformViewBookDetails = (arrayData) => {
  let data = null;

  if (arrayData) {
    data = this.bookTransform(arrayData);
  }
  return data;
};

exports.transformBookDetails = (arrayData) => {
  let data = [];

  if (arrayData && arrayData.length > 0) {
    arrayData.forEach((a) => {
      data.push(this.bookTransform(a));
    });
  }

  arrayData = data;
  return arrayData;
};
