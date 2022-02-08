import 'dotenv/config';
import express, { Request, Response } from 'express';
import { Kafka } from 'kafkajs';
import Mailer from './Mail';

const app = express();

const kafka = new Kafka({
  clientId: 'ms-emails',
  brokers: ['kafka:29092']
});

const topicNormalUser = 'user_newbet';
const consumerNormalUser = kafka.consumer({ groupId: 'newbet-users' });

const topicAdmin = 'newbet_admin';
const consumerAdmin = kafka.consumer({ groupId: 'newbet-admin'});

const topicForgetPassword = 'forget_password';
const forgetPasswordConsumer = kafka.consumer({ groupId: 'forget-password' })

const topicNewUser = 'account_created';
const consumerNewUser = kafka.consumer({ groupId: 'new-account' });

const topicNoBet = 'no_betting';
const consumerNoBet = kafka.consumer({ groupId: 'no-bet' });

const mailer = new Mailer();

async function sendNewBetEmailsToUser() {  
  await consumerNormalUser.connect();
  await consumerNormalUser.subscribe({ topic: topicNormalUser, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });
  await consumerNormalUser.run({
    eachMessage: async ({ topic, partition, message}) => {            
      const data = message.value!.toString();
      const dataJson = JSON.parse(data);

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

async function sendNewBetEmailsToAdmins() {
  await consumerAdmin.connect();
  await consumerAdmin.subscribe({ topic: topicAdmin, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });

  await consumerAdmin.run({
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

async function sendForgetPasswordEmail() {
  await forgetPasswordConsumer.connect();
  await forgetPasswordConsumer.subscribe({ topic: topicForgetPassword, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });

  await forgetPasswordConsumer.run({
    eachMessage: async ({ topic, partition, message}) => {            
      const data = message.value!.toString();
      const dataJson = JSON.parse(data)      

      await mailer.sendMail({
        subject: dataJson['subject'],
        type: dataJson['type'],        
        url: dataJson['url'],
        email: dataJson['email'],
        name: dataJson['username'],
        value: dataJson['value']
      });      
    }
  });
}

async function sendNewUserEmail() {
  await consumerNewUser.connect();
  await consumerNewUser.subscribe({ topic: topicNewUser, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });

  await consumerNewUser.run({
    eachMessage: async ({ topic, partition, message}) => {            
      const data = message.value!.toString();
      const dataJson = JSON.parse(data)      

      await mailer.sendMail({
        subject: dataJson['subject'],
        type: dataJson['type'],                
        name: dataJson['username'], 
        email: dataJson['email'], 
      });      
    }
  });
}

async function sendNoBetEmail() {
  await consumerNoBet.connect();
  await consumerNoBet.subscribe({ topic: topicNoBet, fromBeginning: true }).then(() => {
    console.log("\n \n subscribed! \n \n")
  });

  await consumerNoBet.run({
    eachMessage: async ({ topic, partition, message}) => {            
      const data = message.value!.toString();
      const dataJson = JSON.parse(data)      

      await mailer.sendMail({
        subject: dataJson['subject'],
        type: dataJson['type'],                
        name: dataJson['username'], 
        email: dataJson['email'], 
      });      
    }
  });
}

sendNewBetEmailsToUser();
sendNewBetEmailsToAdmins();
sendForgetPasswordEmail();
sendNewUserEmail();
sendNoBetEmail();

app.listen(3000);