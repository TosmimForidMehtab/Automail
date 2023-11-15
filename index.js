import express from "express";
import gmailController from "./controllers/gmailController.js";

const app = express();
const PORT = 8080;

app.use("/", gmailController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
