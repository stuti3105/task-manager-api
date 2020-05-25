const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENTGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
      to: email,
      from: "stutiagarwal34@gmail.com",
      subject: "Welcome OnBoard",
      text: `Welcome to our Task App ${name}!. Tell us about how you are getting along.`
    });
}

const sendGoodByeEmail = ()=> {
    sgMail.send({
        to: email,
        from: "stutiagarwal34@gmail.com",
        subject: "Sorry to see you go",
        text: `GoodBye, ${name}, We would like here what went wrong and have some feedback. Thanks!!`
    });
}

module.exports = {
  sendWelcomeEmail,
  sendGoodByeEmail
};
