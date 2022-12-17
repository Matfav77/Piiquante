const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { findOne } = require("../models/user");

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hash });
        await newUser.save();
        res.status(200).json({ message: "Utilisateur créé !" })
    } catch (error) {
        res.status(401).json({ error })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Paire identifiant/mot de passe invalide." })
        else {
            isValid = await bcrypt.compare(password, user.password)
            if (!isValid) return res.status(401).json({ message: "Paire identifiant/mot de passe invalide." })
            else {
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                })
            }
        }
    } catch (error) {
        res.status(500).json({ error })
    }

}