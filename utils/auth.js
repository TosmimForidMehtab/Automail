import path from "path";
import { authenticate } from "@google-cloud/local-auth";

const SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.labels",
    "https://mail.google.com/",
];
const __dirname = path.resolve();
const getAuth = async () => {
    return await authenticate({
        keyfilePath: path.join(__dirname, "/credentials.json"),
        scopes: SCOPES,
    });
};

export default getAuth;
