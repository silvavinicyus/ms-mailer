import Mail from 'nodemailer';

export default class Mailer {

  public transporter;

  constructor() {
    const host = process.env.MAILTRAP_HOST;
    const user = process.env.MAILTRAP_USER;
    const password = process.env.MAILTRAP_PASS;    

    this.transporter = Mail.createTransport({
      host,
      port: 2525,
      secure: false,
      requireTLS: true,
      auth: {
        user,
        pass: password
      },
      logger: true,
    });
  }

  async sendMail(email: string) {
    const info = await this.transporter.sendMail({
      from: 'Bet-Lotery <admin@bet.lotery.com>',
      to: email,
      subject: "New Bet",
      text: "Thank You for the new bet",
      html: `<h1> Hello, ${email} </h1> <p> Your bet has been succesfully created, amount: R$ ${ 30 } ! </p>`,
      headers: { 'x-myheader': 'New Bet Header' }
    });

    return info;
  }
}