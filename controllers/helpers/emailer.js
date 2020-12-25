const config = require('../../config');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.SENDGRID_API_KEY);


function newUserEmail(email, name){
    const msg = {
        to: 'keith@raincityambience.com',
        from: 'keith@raincityambience.com', // Use the email address or domain you verified above
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
    to: config.TEST_EMAIL,
    from: config.TEST_EMAIL,
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
        const url = "http://localhost:3000/invite";
        return {
            to: config.TEST_EMAIL,
            from: config.TEST_EMAIL,
            subject: "You're invited to {{ League Name }}",
            html: `
                <h1>Welcome to {{ League Name }}</h1>
                <p>Hi ${first_name} ${last_name},</p>
                <p>You've been added to {{ League Name }} as a ${user_role}.</p>
                <p>Click the link below to finish your registration:</p>
                <p><a href=${url}/?token=${invite_token}>${url}</a></p>

                <p>email sent to: ${email}</p>
            `,
        }
    },
};

module.exports = {
    newUserEmail,
    sendmail,
}