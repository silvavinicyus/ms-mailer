import Mail from 'nodemailer';

interface IRequestData {
  subject: any;  
  type: any;
  email: any;
  name: any;
  value: any;
  url?: any;
}

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

  async sendMail({subject, type, url, email, name, value}: IRequestData) {    

    const kindMessages: any = {
      newBet: `<h1> Hello, ${name} </h1> <p> Your bet has been succesfully created, amount: R$ ${value} ! </p>`,      
      newAccount: `<h1> Hello, ${name} </h1> <p> Welcome to our site, feel free to make your bets when and wherever you want! </>`,
      noBet: `<h1> Hello, ${name} </h1 <p> It's been some time since your last bet with us, come to our new Site do checkout our new categories! </> `,
      forgotPassword: `<h1> Forgot Password </h1 <h2> Hello, ${name} </h2> <p> Your request to change your password has been received, click <a href = ${url}> 
      here </a> bellow to change the password. If it wasn't you, consider change your password. </p> `
    }

    const info = await this.transporter.sendMail({
      from: 'Bet-Lotery <admin@bet.lotery.com>',
      to: email,
      subject: subject,      
      html: kindMessages[type],
      headers: { 'x-myheader': 'New Bet Header' }
    });

    return info;
  }
}