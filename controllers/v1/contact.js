const mongoose = require("mongoose");
const contactModel = require("./../../models/contact");
const nodemailer = require("nodemailer");

exports.getAll = async (req, res) => {
    const contacts = await contactModel.find({}).lean();

    return res.json(contacts);
};

exports.create = async (req, res) => {
    const { name, email, phone, body } = req.body;

    const Contact = await contactModel.create({
        name,
        email,
        phone,
        body,
        answer: 0,
    });

    return res.status(201).json(Contact);
};

exports.remove = async (req, res) => {
    const isValidContactID = mongoose.Types.ObjectId.isValid(req.params.id);

    if (!isValidContactID) {
        return res.status(409).json({ message: "Contact Id Is Not Valid" });
    }

    const removedContact = await contactModel.findOneAndDelete({
        _id: req.params.id,
    });

    if (!removedContact) {
        return res.status(404).json({ message: "Contact Not Found" });
    }

    return res.json(removedContact);
};

exports.answer = async (req, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "power.mahan@gmail.com",
            pass: "uoyr mdyq epwv vvib",
        },
    });

    const mailOptions = {
        from: "power.mahan@gmail.com",
        to: req.body.email,
        subject: "This Is A test For Contacts API",
        text: req.body.answer,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
            return res.json(error);
        } else {
            const contact = await contactModel.findOneAndUpdate(
                { email: req.body.email },
                { answer: 1 }
            );
            console.log(contact);
            return res.json({ message: "Email Sent Successfully" });
        }
    });
};
