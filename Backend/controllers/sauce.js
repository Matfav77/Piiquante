const Sauce = require("../models/sauce");
const fs = require("fs");
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
        if (foundSauce.userId !== req.auth.userId) res.status(403).json({ message: "403: unauthorized request." })
        else {
            if (req.file) {
                fs.unlink(`images/${foundSauce.imageUrl.split('/images/')[1]}`, (err) => {
                    if (err) throw err
                    console.log('image deleted successfully.');
                })
            }
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
            fs.unlink(`images/${foundSauce.imageUrl.split('/images/')[1]}`, (err) => {
                if (err) throw err
                console.log('image deleted successfully.');
            })
            await Sauce.findByIdAndDelete(id);
            res.status(201).json({ message: "Sauce deleted successfully" });
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}

exports.likeSauce = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { id: sauceId } = req.params;
        const foundSauce = await Sauce.findById(sauceId);
        switch (req.body.like) {
            case -1:
                foundSauce.usersDisliked.push(userId);
                foundSauce.dislikes++;
                await Sauce.findByIdAndUpdate(sauceId, foundSauce);
                res.status(201).json({ message: "Sauce disliked successfully" })
                break;
            case 0:
                if (foundSauce.usersLiked.includes(userId)) {
                    await Sauce.findByIdAndUpdate(sauceId, { usersLiked: foundSauce.usersLiked.filter(e => e != userId), likes: foundSauce.likes - 1 });
                    res.status(200).json({ message: "Like cancelled successfully" })
                } else {
                    await Sauce.findByIdAndUpdate(sauceId, { usersDisliked: foundSauce.usersDisliked.filter(e => e != userId), dislikes: foundSauce.dislikes - 1 })
                    res.status(200).json({ message: "Dislike cancelled successfully" })
                }
                break;
            case 1:
                foundSauce.usersLiked.push(userId);
                foundSauce.likes++;
                await Sauce.findByIdAndUpdate(sauceId, foundSauce);
                res.status(201).json({ message: "Sauce liked successfully" })
                break;
            default: res.status(400).json({ message: "Invalid input" })
                break;
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}