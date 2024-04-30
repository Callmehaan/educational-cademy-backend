const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAccept: {
            type: Number,
            default: 0,
            required: true,
        },
        score: {
            type: Number,
            required: true,
            default: 5,
        },
        isAnswer: {
            type: Number,
            required: true,
        },
        mainCommentID: {
            type: mongoose.Types.ObjectId,
            ref: "Comment",
        },
    },
    { timestamps: true }
);

const model = mongoose.model("Comment", schema);

module.exports = model;
