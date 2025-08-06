const nodemailer = require('nodemailer');
const fs = require('fs');
const User = require('../models/userModel');

const htmlTemplate = fs.readFileSync('./templates/book_due.html', 'utf-8');

exports.sendEmail = async (book, userId,daysLeft) => {
    const user = await User.findById(userId);
    const emailHtml = htmlTemplate
        .replace('{{userName}}', user.firstName +'' + user.lastName)
        .replace('{{bookTitle}}', book.bookId.title)
        .replace('{{dueDate}}', book.dueDate)
        .replace('{{daysLeft}}', daysLeft )
        .replace('{{returnLink}}', 'https://yourlibrary.com/return')
        .replace('{{year}}', new Date().getFullYear());

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_EMAIL_PASSWORD,
        }
    });

    await transporter.sendMail({
        from: `Scholarly ${process.env.MY_EMAIL}`,
        to: user.email,
        subject: 'Reminder: Book Due Soon',
        html: emailHtml
    });
}
