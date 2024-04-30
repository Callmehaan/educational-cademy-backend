const mongoose = require("mongoose");
const offsModel = require("./../../models/off");
const courseModel = require("./../../models/course");

exports.getAll = async (req, res) => {
    const offs = await offsModel
        .find({}, "-__v")
        .populate("course", "name href")
        .populate("creator", "name")
        .lean();

    return res.json({ offs });
};

exports.create = async (req, res) => {
    const { code, course, percent, max } = req.body;

    const newOff = await offModel.create({
        code,
        course,
        percent,
        max,
        uses: 0,
        creator: req.user._id,
    });

    return res.status(201).json(newOff);
};

exports.setOnAll = async (req, res) => {
    const { discount } = req.body;

    const coursesDiscounts = await courseModel.updateMany({ discount });

    return res.json({ message: "Discounts Set Successfully" });
};

exports.getOne = async (req, res) => {
    const { code } = req.params;
    const { course } = req.body;

    if (!mongoose.Types.ObjectId.isValid(course)) {
        return res.status(409).json({ message: "Course ID Is Not Valid" });
    }

    const off = await offsModel.findOne({ code, course }).lean();

    if (!off) {
        return res.status(409).json({ message: "Code Is Not Valid" });
    } else if (off.max === off.uses) {
        return res.status(409).json({ message: "This Code Is Already Used" });
    } else {
        await offsModel.findOneAndUpdate(
            { code, course },
            { uses: off.uses + 1 }
        );
        return res.json(off);
    }

    return res.json({ message: "Code Is Valid" });
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(409).json({ message: "Off ID Is Not Valid" });
    }

    const removedOff = await offsModel.findOneAndDelete({ _id: id });

    if (!removedOff) {
        return res.status(404).json({ message: "Off Code Is Not Found" });
    }

    return res.json(removedOff);
};
