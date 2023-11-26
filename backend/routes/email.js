const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, from,subject, templateId, dynamicTemplateData }) => {
    const msg = {
        to,
        from,
        subject,
        templateId,
        dynamicTemplateData,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent with template');
    } catch (error) {
        console.error('Error sending email with template:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = sendEmail;

