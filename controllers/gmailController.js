import express from "express";
import getAuth from "../utils/auth.js";
import {
    createLabel,
    getUnrepliedEmails,
    sendReplyAndModify,
} from "../services/gmailService.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const auth = await getAuth();
    const labelId = await createLabel(auth);

    setInterval(async () => {
        const unrepliedEmails = await getUnrepliedEmails(auth);
        if (unrepliedEmails && unrepliedEmails.length > 0) {
            for (const email of unrepliedEmails) {
                await sendReplyAndModify(auth, email.id, labelId);
            }
        }
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
    res.status(200).json({ message: "Email automation started" });
});

export default router;
