const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hash });
    newUser.save()
        .then(() => { res.status(200).json({ message: "Utilisateur créé !" }) })
        .catch(err => res.status(401).json({ err }))
}