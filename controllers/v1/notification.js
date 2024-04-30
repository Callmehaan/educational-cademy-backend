const notificationModel = require("./../../models/notification");

exports.create = async (req, res) => {
    const { message, admin } = req.body;

    //Validate

    const notification = await notificationModel.create({
        message,
        admin,
    });

    return res.status(201).json(notification);
};

exports.get = async (req, res) => {
    const { _id } = req.user;

    const adminNotifications = await notificationModel.find({ admin: _id });

    return res.json(adminNotifications);
};

exports.seen = async (req, res) => {
    const { id } = req.params;

    //Validate

    const notification = await notificationModel.findOneAndUpdate(
        { _id: id },
        { seen: 1 }
    );

    return res.json(notification);
};

exports.getAll = async (req, res) => {
    const notifications = await notificationModel.find({}).lean();

    return res.json(notifications);
};

exports.remove = async (req, res) => {
    const { id } = req.params;

    //Validate

    const removedNotification = await notificationModel.findOneAndDelete({
        _id: id,
    });

    if (!removedNotification) {
        return res.status(404).json({ message: "Notification Not Found" });
    }

    return res.json(removedNotification);
};
