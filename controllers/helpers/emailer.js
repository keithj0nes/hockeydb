const sgMail = require('@sendgrid/mail');
const isProduction = require('../helpers').isProduction;
let config;
if (!isProduction) config = require('../../config');

sgMail.setApiKey(process.env.SENDGRID_API_KEY || config.SENDGRID_API_KEY);
const testEmail = process.env.TEST_EMAIL || config.TEST_EMAIL;
const url = process.env.SITE_URL || config.SITE_URL;
const leagueName = 'United States Hockey League';
const aOrAn = str => (/^[aeiou]$/i).test(str.charAt(0)) ? 'an' : 'a';

function newUserEmail(email, name){
    const msg = {
        to: testEmail,
        from: testEmail, // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg).then((sent, error) => {
      // Awesome Logic to check if mail was sent
      console.log({sent, error}, 'sent!')
      return "sent!"
    }).catch(err => {
        console.log({err: err.toString()})
        return err;
    })
}

const defaultMessage = {
    to: testEmail,
    from: testEmail,
    subject: 'Sending default message',
    html: '<strong>If you get this message, there was an error</strong>',
};

const sendmail = async ({ template, data }) => {
    const msg = templates[template]({data}) || defaultMessage;
    if (!data.email) throw Error('Email is required to send an email');
    try {
        const [sent, error] = await sgMail.send(msg);
        if (!!sent) console.log(`email sent to: ${isProduction ? data.email : testEmail}`);
        if (!!error) {
            console.log(`email error: ${error}`);
            throw error;
        }
        return sent.statusCode > 200 ? true : false;
    } catch (err) {
        console.log({ err: err.toString() });
        return err;
    }
}

const templates = {
    inviteUser: ({ data }) => {
        const { email, first_name, last_name, user_role, invite_token } = data;
        return {
            to: isProduction ? email : testEmail,
            from: testEmail,
            subject: `You're invited to ${leagueName}`,
            html: `
                <h1>Welcome to ${leagueName}</h1>
                <p>Hi ${first_name} ${last_name},</p>
                <p>You've been added to ${leagueName} as ${aOrAn(user_role)} ${user_role}.</p>
                <p>Click the link below to finish your registration:</p>
                <p><a href=${url}/invite/?token=${invite_token}>${url}</a></p>

                <p>email sent to: ${email}</p>
            `,
        }
    },

    resetPassword: ({ data }) => {
        const { email, first_name, invite_token } = data;
        return {
            to: isProduction ? email : testEmail,
            from: testEmail,
            subject: `Reset Password - ${leagueName}`,
            html: `
                <h1>${leagueName}</h1>
                <p>Hi ${first_name},</p>
                <p>Looks like you requested to reset your password. If you did not make this request, don't worry, can disregard this email</p>
                <br />
                <p>Click the link below to update your password and log in:</p>
                <p><a href=${url}/reset/?token=${invite_token}>${url}</a></p>
                

                <p>email sent to: ${email}</p>
            `,
        }
    },
};

module.exports = {
    newUserEmail,
    sendmail,
}