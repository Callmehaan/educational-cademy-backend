const userModel = require("./../../models/user");
const banUserModel = require("./../../models/ban-phone");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

exports.banUser = async (req, res) => {
    const mainUser = await userModel.findOne({ _id: req.params.id }).lean();
    const banUserResult = await banUserModel.create({
        phone: mainUser.phone,
    });

    if (banUserResult) {
        return res.status(200).json({ message: "User Banned Successfully" });
    }

    return res.status(500).json({ message: "Server Error !!!" });
};

exports.getAll = async (req, res) => {
    const users = await userModel.find({}, "-password");

    return res.json(users);
};

exports.removeUser = async (req, res) => {
    const isValidUserId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidUserId) {
        return res.status(409).json({ message: "User Id Is Not Valid" });
    }

    const removedUser = await userModel.findByIdAndDelete({
        _id: req.params.id,
    });

    if (!removedUser) {
        return res.status(404).json({ message: "There Is No User" });
    }

    return res.ststus(200).json({ message: "User Removed Successfully" });
};

exports.changeRole = async (req, res) => {
    const { id } = req.body;

    const isValidUserId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidUserId) {
        return res.status(409).json({ message: "User Id Is Not Valid" });
    }

    const user = await userModel.findOne({ _id: id });

    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await userModel.findByIdAndUpdate(
        { _id: id },
        { role: newRole }
    );

    if (updatedUser) {
        return res.json({ message: "User Role Changed Successfully" });
    }
};

exports.updateUser = async (req, res) => {
    const { username, name, password, email, phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await userModel
        .findByIdAndUpdate(
            { _id: req.user._id },
            {
                name,
                username,
                password: hashedPassword,
                phone,
            }
        )
        .select("-password")
        .lean();

    return res.json(user);
};
