const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT;

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully :)");
})();

app.get("/", (req, res) => {
    console.log("Headers => ", req.header("Authorization").split(" ")[1]);
    res.json({ message: "OK" });
});

app.listen(port, () => {
    console.log(`Server Running On Port ${port}`);
});
