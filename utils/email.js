const nodemailer = require('nodemailer');
const pug        = require('pug');
const htmlToText = require('html-to-text')
const sgMail     = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

module.exports = class Email{
    constructor(user, url) {
        this.to         = user.email;
        this.firstName  = user.name.split(' ')[0];
        this.url        = url;
        this.from       = process.env.EMAIL_FROM
    }

    newTransport(){
 
        if(process.env.NODE_ENV === 'production'){
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
        }
        
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject){

        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName:  this.firstName,
            url:        this.url,
            subject:    this.subject
        });

        // 2) Define the email options
        const mailOptions = {
            from:       this.from,
            to:         this.to,
            subject:    subject,
            html:       html,
            text:       htmlToText.fromString(html),
        }
        // process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
        // await this.newTransport().sendMail(mailOptions);
        await sgMail.send(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome', 'Bem Vindo à Fiskamer');
    }
    
    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token (Valid for 24h)');
    }
}

