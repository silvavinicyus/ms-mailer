import 'dotenv/config';
import express, { Request, Response } from 'express';
import Mailer from './Mail';

const app = express();

app.post('/send/:email', async (request: Request, response: Response) => {
  const { email } = request.params;

  const transporter = new Mailer();

  const info = await transporter.sendMail(email);

  return response.json(info);  
});


app.listen(3333, () => {
  console.log("Server started at port 3333!");
});