const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const { findOne } = require("../models/user");
require('dotenv').config();

const pwSchema = new passwordValidator();

pwSchema
    .is().min(8)
    .is().max(25)
    .has().letters()
    .has().lowercase()
    .has().uppercase()
    .has().digits();

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (emailValidator.validate(email)) {
            if (pwSchema.validate(password)) {
                const hash = await bcrypt.hash(password, 10);
                const newUser = new User({ email, password: hash });
                await newUser.save();
                return res.status(200).json({ message: "User created!" });
            } else {
                let errors = "";
                pwSchema.validate(password, { details: true }).forEach(e => errors += e.message + ". ");
                return res.status(400).json({ message: errors })
            }
        } else {
            return res.status(400).json({ message: "Email format is incorrect." })
        }
    } catch (error) {
        res.status(401).json({ error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid login or password." })
        else {
            isValid = await bcrypt.compare(password, user.password)
            if (!isValid) return res.status(401).json({ message: "Invalid login or password." })
            else {
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.TOKEN_KEY,
                        { expiresIn: '24h' }
                    )
                })
            }
        }
    } catch (error) {
        res.status(500).json({ error })
    }

}