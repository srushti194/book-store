const userModel = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {JWT_AUTH_TOKEN_SECRET, JWT_EXPIRES_IN} = require("../config/key")
const userTransformer = require("../transformer/userTransformer")
const {registerValidation, loginValidation} = require("../validation/authValidation")

exports.register = async (req, res) => {
    try {
        let reqBody = req.body;

        // For validate request
        const {error} = registerValidation(reqBody);
		if (error) return res.status(400).send({statusCode: 400, message: `${error.details.map((elem) => elem.message).join(",")}`});

        // To check unique email address
        let userEmailExist = await userModel.findOne({where: {email: reqBody.email.toLowerCase(), isDeleted: false}});
        if (userEmailExist) return res.status(400).send({statusCode: 400, message: "Email already exists"})

        let userData = {
            firstName: reqBody.firstName,
            lastName: reqBody.lastName,
            email: reqBody.email.toLowerCase(),
            password: await bcrypt.hashSync(reqBody.password)
        }

        const newUser = await userModel.create(userData)

        // To create jwt token for authentication
        let tokenObject = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isDeleted: newUser.isDeleted
        };

        let tokenData = jwt.sign({tokenObject}, JWT_AUTH_TOKEN_SECRET, {expiresIn: JWT_EXPIRES_IN});

        // Created a utility function for security and key binding
        const responseData = userTransformer.transformUserDetails(newUser);

        return res.status(200).send({statusCode: 200, message: "User registered successfully", data: responseData, tokenData: tokenData});
    } catch (e) {
        return res.status(500).send({statusCode: 500, message: "Something went wrong"})
    }
}

exports.login = async (req, res) => {
    try {
        let reqBody = req.body;

        // For validate request
        const {error} = loginValidation(reqBody);
		if (error) return res.status(400).send({statusCode: 400, message: `${error.details.map((elem) => elem.message).join(",")}`});

        let userFound = await userModel.findOne({where: {email: reqBody.email.toLowerCase(), isDeleted: false}});
        if (!userFound) return res.status(400).send({statusCode: 400, message: "You have entered wrong email or password"});

        // For compare user's password
        if (bcrypt.compareSync(reqBody.password, userFound.password)) {
            let tokenObject = {
                id: userFound.id,
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                email: userFound.email,
                isDeleted: userFound.isDeleted
            };

            var tokenData = await jwt.sign({tokenObject}, JWT_AUTH_TOKEN_SECRET, {expiresIn: JWT_EXPIRES_IN});

            // Created a utility function for security and key binding
            let userData = await userTransformer.transformUserDetails(userFound)

            return res.status(200).send({statusCode: 200, message: "User logged in successfully", data: userData, tokenData: tokenData})
        } else {
            return res.status(400).send({statusCode: 400, message: "You have entered wrong email or password"})
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send({statusCode: 500, message: "Something went wrong"})
    }
}