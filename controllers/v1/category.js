const categoryValidator = require("./../../validators/category");
const categoryModel = require("./../../models/category");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
    const validatorResult = categoryValidator(req.body);

    if (validatorResult != true) {
        return res.status(422).json(validatorResult);
    }

    const category = await categoryModel.create(req.body);

    return res.status(201).json(category);
};

exports.getAll = async (req, res) => {
    const categories = await categoryModel.find({}).lean();

    return res.json(categories);
};

exports.remove = async (req, res) => {
    const isValidCategoryId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidCategoryId) {
        return res.status(409).json({ message: "Category Id Is Not Valid" });
    }

    const removedCategory = await categoryModel.findByIdAndDelete({
        _id: req.params.id,
    });

    if (!removedCategory) {
        return res.status(404).json({ message: "Category Not Found" });
    }

    return res.status(200).json({ message: "Category Removed Successfully" });
};

exports.update = async (req, res) => {
    const isValidCategoryId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidCategoryId) {
        return res.status(409).json({ message: "Category Id Is Not Valid" });
    }

    const validatorResult = categoryValidator(req.body);

    if (validatorResult != true) {
        return res.status(422).json(validatorResult);
    }

    const { title, href } = req.body;

    const updatedCategory = await categoryModel
        .findByIdAndUpdate(
            { _id: req.params.id },
            {
                title,
                href,
            }
        )
        .lean();

    return res.json(updatedCategory);
};
