const mongoose = require("mongoose");
const commentModel = require("./../../models/comment");
const courseModel = require("./../../models/course");

module.exports.create = async (req, res) => {
    const { body, courseHref, score } = req.body;

    const course = await courseModel.findOne({ href: courseHref }).lean();

    const comment = await commentModel.create({
        body,
        course: course._id,
        creator: req.user._id,
        score,
        isAnswer: 0,
        isAccept: 0,
    });

    const allComments = await commentModel
        .find({ course: course._id, isAccept: 1 })
        .lean();

    let scores = [];
    allComments.forEach((comment) => {
        scores.push(comment.score);
    });

    let scoresLength = scores.length;

    let sum = scores.reduce((prev, curr) => {
        return prev + curr;
    });

    sum = Math.round(sum / scoresLength);

    const finalCourse = await courseModel.findOneAndUpdate(
        { href: courseHref },
        { score: sum }
    );
    console.log("finalCourse : ", finalCourse);
    return res.status(201).json(comment);
};

exports.getAll = async (req, res) => {
    const comments = await commentModel
        .find({})
        .populate("course")
        .populate("creator", "-password")
        .lean();

    let allComments = [];

    comments.forEach((comment) => {
        comments.forEach((answerComment) => {
            if (String(comment._id) == String(answerComment.mainCommentID)) {
                allComments.push({
                    ...comment,
                    course: comment.course.name,
                    creator: comment.creator.name,
                    answerComment,
                });
            }
        });
    });

    return res.json(allComments);
};

exports.remove = async (req, res) => {
    const isValidCommentID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidCommentID) {
        return res.status(409).json({ message: "Comment Id Is Not Valid" });
    }

    const removedComment = await commentModel.findOneAndDelete({
        _id: req.params.id,
    });

    if (!removedComment) {
        return res.status(404).json({ message: "Comment Not Found" });
    }

    return res.json(removedComment);
};

exports.accept = async (req, res) => {
    const isValidCommentID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidCommentID) {
        return res.status(409).json({ message: "Comment Id Is Not Valid" });
    }

    const acceptedComment = await commentModel.findOneAndUpdate(
        { _id: req.params.id },
        { isAccept: 1 }
    );

    if (!acceptedComment) {
        return res.status(404).json({ message: "Comment Not Found" });
    }

    return res.json({ message: "Comment Accepted Successfully" });
};

exports.reject = async (req, res) => {
    const isValidCommentID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidCommentID) {
        return res.status(409).json({ message: "Comment Id Is Not Valid" });
    }

    const rejectedComment = await commentModel.findOneAndUpdate(
        { _id: req.params.id },
        { isAccept: 0 }
    );

    if (!rejectedComment) {
        return res.status(404).json({ message: "Comment Not Found" });
    }

    return res.json({ message: "Comment Rejected Successfully" });
};

exports.answer = async (req, res) => {
    const { body } = req.body;

    const acceptedComment = await commentModel.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        { isAccept: 1 }
    );

    if (!acceptedComment) {
        return res.status(404).json({ message: "Comment Not Found" });
    }

    const answerComment = await commentModel.create({
        body,
        course: acceptedComment.course,
        creator: req.user._id,
        isAnswer: 1,
        isAccept: 1,
        mainCommentID: req.params.id,
    });

    return res.status(201).json(answerComment);
};
