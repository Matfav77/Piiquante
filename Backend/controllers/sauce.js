const Sauce = require("../models/sauce");
const { findOne, findById } = require("../models/user");


exports.getAllSauces = async (req, res) => {
    try {
        const allSauces = await Sauce.find();
        res.send(allSauces)
    } catch (error) {
        res.status(500).json({ error })
    }
};

exports.getOneSauce = async (req, res) => {
    try {
        const { id } = req.params;
        const foundSauce = await Sauce.findById(id);
        res.send(foundSauce);
    } catch (error) {
        res.status(500).json({ error })
    }

}

exports.createSauce = async (req, res) => {
    try {
        const sauceInfo = JSON.parse(req.body.sauce);
        delete sauceInfo.userId;
        const newSauce = new Sauce({
            ...sauceInfo,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            userId: req.auth.userId
        });
        await newSauce.save();
        res.status(201).json({ message: "Sauce créée avec succès !" })
    } catch (error) {
        res.status(500).json({ error })
    }
}