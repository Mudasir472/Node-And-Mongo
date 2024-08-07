const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "bhatmuddu472@gmail.com",
        pass: "bnri fnzr tbgh slms",
    },
});

async function sentMail(sixDigitNumber,email) {
    try {
        const info = await transporter.sendMail({
            from: "Mudasir Bhat", // sender address
            to: `${email}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: `<h1>Hi this is Muddu sends you a code to verify,code : ${sixDigitNumber} </h1>`,
        });
        // console.log(info)
    }
    catch(err){
        console.log(err)
    }
}

module.exports = sentMail;
