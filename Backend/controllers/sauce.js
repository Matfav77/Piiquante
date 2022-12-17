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
        res.status(400).json({ error })
    }
}

exports.modifySauce = async (req, res) => {
    try {
        const updatedSauce = req.file ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        const { id } = req.params;
        const foundSauce = await Sauce.findById(id);
        if (foundSauce.userId != req.auth.userId) { res.status(403).json({ message: "403: unauthorized request." }) }
        else {
            await Sauce.findByIdAndUpdate(id, updatedSauce);
            res.status(200).json({ message: "Sauce modifiée !" })
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.deleteSauce = async (req, res) => {
    try {
        const { id } = req.params;
        const foundSauce = await Sauce.findById(id);
        if (foundSauce.userId !== req.auth.userId) {
            res.status(403).json({ message: "403: unauthorized request." })
        } else {
            await Sauce.findByIdAndDelete(id);
            res.status(201).json({ message: "Sauce deleted successfully" });
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

