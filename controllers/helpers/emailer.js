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

    try {
        const sent = await sgMail.send(msg);
        // Awesome Logic to check if mail was sent
        console.log({ sent }, 'sent!');
        return true;
    } catch (err) {
        console.log({ err: err.toString() });
        return err;
    }
}

const templates = {
    inviteUser: ({ data }) => {
        const { email, first_name, last_name, user_role, invite_token } = data;
        return {
            // to: config.TEST_EMAIL,
            to: isProduction ? email : testEmail,
            from: testEmail,
            subject: `You're invited to ${leagueName}`,
            html: `
                <h1>Welcome to ${leagueName}</h1>
                <p>Hi ${first_name} ${last_name},</p>
                <p>You've been added to ${leagueName} as ${isOrAn(user_role)} ${user_role}.</p>
                <p>Click the link below to finish your registration:</p>
                <p><a href=${url}/invite/?token=${invite_token}>${url}</a></p>

                <p>email sent to: ${email}</p>
            `,
        }
    },
};

module.exports = {
    newUserEmail,
    sendmail,
}