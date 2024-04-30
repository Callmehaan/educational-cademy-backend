const { findById } = require("../../models/user");
const articlesModel = require("./../../models/article");
const mongoose = require("mongoose");

exports.getAll = async (req, res) => {
    const allArticles = await articlesModel
        .find({}, "-__v")
        .populate("creator", "-password -__v")
        .populate("categoryID", "-__v");

    return res.json(allArticles);
};

exports.create = async (req, res) => {
    const { title, description, body, href, categoryID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        return res.status(409).json({ message: "Category ID Is Not Valid" });
    }

    const article = await articlesModel.create({
        title,
        body,
        description,
        href,
        categoryID,
        cover: req.file.filename,
        creator: req.user._id,
        publish: 1,
    });

    const mainArticle = await articlesModel
        .findById(article._id)
        .populate("creator", "-password")
        .lean();

    return res.status(201).json(mainArticle);
};

exports.getOne = async (req, res) => {
    const { href } = req.params;

    const article = await articlesModel
        .findOne({ href })
        .populate("creator", "-password -__v")
        .populate("categoryID", "-__v")
        .lean();

    return res.json(article);
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(409).json({ message: "Article ID Is Not Valid" });
    }

    const removedArticle = await articlesModel.findOneAndDelete({ _id: id });

    if (!removedArticle) {
        return res.status(404).json({ message: "Article Not Found" });
    }

    return res.json(removedArticle);
};

exports.saveDraft = async (req, res) => {
    const { title, description, body, href, categoryID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        return res.status(409).json({ message: "Category ID Is Not Valid" });
    }

    const article = await articlesModel.create({
        title,
        body,
        description,
        href,
        categoryID,
        cover: req.file.filename,
        creator: req.user._id,
        publish: 0,
    });

    const mainArticle = await articlesModel
        .findById(article._id)
        .populate("creator", "-password")
        .lean();

    return res.status(201).json(mainArticle);
};
