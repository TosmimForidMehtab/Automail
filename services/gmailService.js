import { google } from "googleapis";

const labelName = "AutoMail";

const getUnrepliedEmails = async (auth) => {
    const gmail = google.gmail({ version: "v1", auth });
    try {
        const response = await gmail.users.messages.list({
            userId: "me",
            labelIds: ["INBOX"],
            q: "is:unread",
        });
        return response.data.messages || [];
    } catch (error) {
        console.log(`Erorr getting unreplied emails: ${error}`);
        throw new Error("Error getting unreplied emails");
    }
};

const createLabel = async (auth) => {
    const gmail = google.gmail({ version: "v1", auth });
    try {
        // If there is already a label with the same name
        let response = await gmail.users.labels.list({
            userId: "me",
        });
        const labels = response.data.labels || [];
        const labelFound = labels.find((label) => label.name === labelName);

        if (labelFound) {
            return labelFound.id;
        } else {
            response = await gmail.users.labels.create({
                userId: "me",
                requestBody: {
                    name: labelName,
                    labelListVisibility: "labelShow",
                    messageListVisibility: "show",
                },
            });
        }
        return response.data.id;
    } catch (error) {
        console.log(`Erorr creating label: ${error}`);
        throw new Error("Error creating label");
    }
};

const sendReplyAndModify = async (auth, emailId, labelId) => {
    const gmail = google.gmail({ version: "v1", auth });

    const messageData = await gmail.users.messages.get({
        auth,
        userId: "me",
        id: emailId,
    });

    const email = messageData.data;
    const hasReplied = email.payload.headers.some(
        (header) => header.name === "In-Reply-To"
    );

    if (!hasReplied) {
        const replyMessage = {
            userId: "me",
            resource: {
                raw: Buffer.from(
                    `To: ${
                        email.payload.headers.find(
                            (header) => header.name === "From"
                        ).value
                    }\r\n` +
                        `Subject: Re: ${
                            email.payload.headers.find(
                                (header) => header.name === "Subject"
                            ).value
                        }\r\n` +
                        `Content-Type: text/plain; charset="utf-8"\r\n` +
                        `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                        `Thanks for contacting me! I am currently busy. I will get back to you as soon as possible.\r\n`
                ).toString("base64"),
            },
        };

        await gmail.users.messages.send(replyMessage);

        // Add the label
        gmail.users.messages.modify({
            auth,
            userId: "me",
            id: emailId,
            resource: {
                addLabelIds: [labelId],
                removeLabelIds: ["INBOX"],
            },
        });
    }
};

export { getUnrepliedEmails, createLabel, sendReplyAndModify };
