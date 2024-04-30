const ticketsModel = require("./../../models/ticket");
const departmentsModel = require("./../../models/department");
const departmentSubsModel = require("./../../models/department-sub");

exports.create = async (req, res) => {
    const { title, body, course, departmentID, departmentSubID, priority } =
        req.body;

    const ticket = await ticketsModel.create({
        user: req.user._id,
        title,
        body,
        course,
        departmentID,
        departmentSubID,
        priority,
        answer: 0,
        isAnswer: 0,
    });

    const mainTicket = await ticketsModel
        .findOne({ _id: ticket._id })
        .populate("departmentID")
        .populate("departmentSubID")
        .populate("user", "-password")
        .lean();

    return res.status(201).json(mainTicket);
};

exports.getAll = async (req, res) => {
    const allTickets = await await ticketsModel
        .find({ answer: 0 })
        .populate("departmentID", "title")
        .populate("departmentSubID")
        .populate("user", "name")
        .lean();

    res.json(allTickets);
};

exports.userTickets = async (req, res) => {
    const tickets = await ticketsModel
        .find({ user: req.user._id })
        .sort({ _id: -1 })
        .populate("departmentID")
        .populate("departmentSubID")
        .populate("user", "-password");

    return res.json(tickets);
};

exports.departments = async (req, res) => {
    const departments = await departmentsModel.find({});

    return res.json(departments);
};

exports.departmentSubs = async (req, res) => {
    const { id } = req.params; //Validate

    const departmentSubs = await departmentSubsModel
        .find({ parent: id })
        .lean();

    return res.json(departmentSubs);
};

exports.setAnswer = async (req, res) => {
    const { body, ticketID } = req.body;

    //Validate

    const ticket = await ticketsModel.findOne({ _id: ticketID }).lean();

    const answer = await ticketsModel.create({
        title: "پاسخ تیتکت شما",
        body,
        parent: ticket._id,
        priority: ticket.priority,
        user: req.user._id,
        isAnswer: 1,
        answer: 0,
        departmentID: ticket.departmentID,
        departmentSubID: ticket.departmentSubID,
    });

    await ticketsModel.findOneAndUpdate({ _id: ticket._id }, { answer: 1 });

    return res.status(201).json(answer);
};

exports.getAnswer = async (req, res) => {
    const { id } = req.params;

    const ticket = await ticketsModel.findOne({ _id: id });
    const ticketAnswer = await ticketsModel.findOne({ parent: id });

    return res.json({
        ticket,
        ticketAnswer: ticketAnswer ? ticketAnswer : null,
    });
};
