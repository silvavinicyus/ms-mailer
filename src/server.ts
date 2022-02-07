import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import Mailer from './Mail';

const app = express();

const kafka = new Kafka({
  clientId: 'ms-emails',
  brokers: ['kafka:29092']
});

const topic = 'newbet';
const consumer = kafka.consumer({ groupId: 'newbet-admins' });

const mailer = new Mailer();

async function sendNewBetEmailsToAdmin() {
  console.log("Send new bet has listen")
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message}) => {            
      const data = message.value!.toString();
      const dataJson = JSON.parse(data)      

      await mailer.sendMail({
        subject: dataJson['subject'],
        type: dataJson['type'],        
        email: dataJson['email'],
        name: dataJson['username'],
        value: dataJson['value']
      });      
    }
  });
}

sendNewBetEmailsToAdmin();

app.listen(3000);