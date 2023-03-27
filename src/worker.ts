/* eslint-disable @typescript-eslint/no-var-requires */
import { Worker } from '@temporalio/worker';
import * as activities from './activities';

// Configuring the express app and setting the routes for unsubscription

const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const fs = require('fs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get('/', function (req: any, res: any) {
  res.render('unsubscribe');
});

app.post('/', function (req: any, res: any) {
  const email = { email: req.body.email };
  const allEmails = fs.readFileSync('emails.json');
  const data = JSON.parse(allEmails);
  const newEmails = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].email !== email.email) {
      newEmails.push(data[i]);
    }
  }
  const newEmailsJson = JSON.stringify(newEmails);
  fs.writeFileSync('emails.json', newEmailsJson);
  res.render('unsubscribe');
});

app.listen(3000, function () {
  console.log('server started on port 3000');
});

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'hello-world',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
