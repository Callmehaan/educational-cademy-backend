const mongoose = require("mongoose");
const courseModel = require("./../../models/course");
const sessionModel = require("./../../models/session");
const categoryModel = require("./../../models/category");
const commentModel = require("./../../models/comment");
const courseUserModel = require("./../../models/course-user");

exports.create = async (req, res) => {
    //Validate
    const {
        name,
        describtion,
        support,
        href,
        price,
        status,
        discount,
        categoryID,
    } = req.body;

    const course = await courseModel.create({
        name,
        describtion,
        creator: req.user._id,
        categoryID,
        support,
        price,
        href,
        status,
        discount,
        cover: req.file.filename,
    });

    const mainCourse = await courseModel
        .findById(course._id)
        .populate("creator", "-password");

    return res.status(201).json(mainCourse);
};

exports.getOne = async (req, res) => {
    const course = await courseModel
        .findOne({ href: req.params.href })
        .populate("creator", "-password")
        .populate("categoryID");

    const sessions = await sessionModel.find({ course: course._id }).lean();
    const comments = await commentModel
        .find({ course: course._id, isAccept: 1 })
        .populate("creator", "-password")
        .populate("course")
        .lean();

    const courseStudentsCount = await courseUserModel
        .find({
            course: course._id,
        })
        .count();

    const isUserRegisterToThisCourse = !!(await courseUserModel.findOne({
        user: req.user._id,
        course: course._id,
    }));

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

    res.json({
        course,
        sessions,
        comments: allComments,
        courseStudentsCount,
        isUserRegisterToThisCourse,
    });
};

exports.getAll = async (req, res) => {
    const courses = await courseModel
        .find({})
        .populate("creator", "-password")
        .populate("categoryID")
        .lean()
        .sort({ _id: -1 });
    const registers = await courseUserModel.find({}).lean();
    const comments = await commentModel.find({}).lean();

    const allCourses = [];

    courses.forEach((course) => {
        let courseTotalScore = 5;

        const courseRegisters = registers.filter(
            (register) => register.course.toString() === course._id.toString()
        );

        const courseComments = comments.filter((comment) => {
            return comment.course.toString() === course._id.toString();
        });

        courseComments.forEach(
            (comment) => (courseTotalScore += Number(comment.score))
        );

        allCourses.push({
            ...course,
            categoryID: course.categoryID.title,
            creator: course.creator.name,
            registers: courseRegisters.length,
            courseAverageScore: Math.floor(
                courseTotalScore / (courseComments.length + 1)
            ),
        });
    });

    return res.json(allCourses);
};

exports.createSession = async (req, res) => {
    const { title, free, time } = req.body;
    const { id } = req.params;

    const session = await sessionModel.create({
        title,
        time,
        free,
        video: "video.mp4", //req.file.filename
        course: id,
    });

    return res.status(201).json(session);
};

exports.getAllSessions = async (req, res) => {
    const sessions = await sessionModel
        .find({})
        .populate("course", "name")
        .lean();

    return res.json(sessions);
};

exports.getSessionInfo = async (req, res) => {
    const course = await courseModel.findOne({ href: req.params.href }).lean();

    const session = await sessionModel
        .findOne({ _id: req.params.sessionID })
        .lean();

    const sessions = await sessionModel.find({ course: course._id }).lean();

    return res.json({ session, sessions });
};

exports.removeSession = async (req, res) => {
    const isValidSessionId = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidSessionId) {
        return res.status(409).json({ message: "Session Id Is Not Valid" });
    }

    const deletedCourse = await sessionModel.findOneAndDelete(req.params.id);

    if (!deletedCourse) {
        return res.status(404).json({ message: "Course Not Found" });
    }

    return res.status(200).json(deletedCourse);
};

exports.register = async (req, res) => {
    const isAlreadyRegister = await courseUserModel
        .findOne({
            user: req.user._id,
            course: req.params.id,
        })
        .lean();

    if (isAlreadyRegister) {
        return res.status(409).json({ message: "User Is Already Registered" });
    }

    const register = await courseUserModel.create({
        user: req.user._id,
        course: req.params.id,
        price: req.body.price,
    });

    return res.status(201).json({ message: "You Are Registered Successfully" });
};

exports.getCoursesByCategory = async (req, res) => {
    const { href } = req.params;
    const category = await categoryModel.findOne({ href }).lean();

    if (category) {
        const categoryCourses = await courseModel
            .find({
                categoryID: category._id,
            })
            .lean();

        return res.json(categoryCourses);
    } else {
        return res.json([]);
    }
};

exports.remove = async (req, res) => {
    const isObjectIdValid = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isObjectIdValid) {
        return res.status(409).json({ message: "Course ID Is Not Valid" });
    }

    const removedCourse = await courseModel.findOneAndDelete({
        _id: req.params.id,
    });

    if (!removedCourse) {
        return res.status(404).json({ message: "Course Not Found" });
    }

    return res.json(removedCourse);
};

exports.getRelated = async (req, res) => {
    const { href } = req.params;

    const course = await courseModel.findOne({ href });

    if (!course) {
        return res.status(404).json({ message: "Course Not Found" });
    }

    let relatedCourses = await courseModel.find({
        categoryID: course.categoryID,
    });

    relatedCourses = relatedCourses.filter((course) => course.href !== href);

    return res.json(relatedCourses);
};

exports.popular = async (req, res) => {
    const courses = await courseModel.find({});

    return res.json(courses);
};

exports.presell = async (req, res) => {
    const presellCourses = await courseModel
        .find({ status: "presell" })
        .populate("creator", "-password")
        .populate("categoryID")
        .lean();

    return res.json(presellCourses);
};
