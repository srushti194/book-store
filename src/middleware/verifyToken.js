const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken")
const {JWT_AUTH_TOKEN_SECRET} = require("../config/key")

exports.verifyAuthToken = (req, res, next) => {
    if (!req.header("Authorization")) return res.status(401).send({statusCode: 401, message: "Token not found"});
    const token = req.header("Authorization").replace("Bearer ", "");

    jwt.verify(token, JWT_AUTH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).send({statusCode: 401, message: "Invalid token"});
        }
        if (!decoded) return res.status(401).send({statusCode: 401, message: "Token expired"});

        let user = await userModel.findOne({where: {id: decoded.tokenObject.id, isDeleted: false}})
        if (user === null || user === undefined) return res.status(401).send({statusCode: 401, message: "Token expired"});
        if (user.isDeleted === false) {
            req.user = user;
            req.token = token;
            next();
        } else {
            return res.status(401).send({statusCode: 401, message: "Unaythorized content"});
        }
    });
};