import { MailService } from "@sendgrid/mail";

const mail = new MailService();

mail.setApiKey(process.env.SENDGRID_API_KEY);

export {mail}