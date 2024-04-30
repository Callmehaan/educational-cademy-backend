const menusModel = require("./../../models/menu");

exports.getAll = async (req, res) => {
    const menus = await menusModel.find({}).lean();

    menus.forEach((menu) => {
        const submenus = [];

        for (let i = 0; i < menus.length; i++) {
            const mainMenu = menus[i];

            // mainMenu.parent?.equals(menu._id)
            if (String(mainMenu.parent) === String(menu._id)) {
                submenus.push(menus.splice(i, 1)[0]);
                i = i - 1;
            }
        }

        menu.submenus = submenus;
    });

    return res.json(menus);
};

exports.create = async (req, res) => {
    const { title, href, parent } = req.body;

    const menu = await menusModel.create({
        title,
        href,
        parent,
    });

    return res.status(201).json(menu);
};

exports.getAllInPanel = async (req, res) => {
    const menus = await menusModel.find({}).populate("parent").lean();

    return res.json(menus);
};

exports.remove = async (req, res) => {};
