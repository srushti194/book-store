exports.userTransform = (data) => {
  return {
    userId: data?.id ? data.id : "",
    firstName: data?.firstName ? data.firstName : "",
    lastName: data?.lastName ? data.lastName : "",
    email: data?.email ? data.email : "",
    isDeleted: data?.isDeleted ? data.isDeleted : false,
  };
};

exports.transformUserDetails = (arrayData) => {
  let userData = null;

  if (arrayData) {
    userData = this.userTransform(arrayData);
  }
  return userData;
};
