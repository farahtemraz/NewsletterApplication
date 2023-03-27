# Yodawy Hiring Task

This project was implemented in compliance to the requirments mentioned in Yodawy's newsletter application task document. The base of the project is obtained from running `npx @temporalio/create@latest ./myfolder`, with the addition of extra functionalities specific for the task requirments.

### Running this project

1. Clone the project into your local machine.
1. Create a .env file in the root directory and paste in it the the provided .env file content sent in the submission email.
1. In your terminal, run `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation) and leave it running. It is supposed to run on `http://localhost:8233/`
1. In another shell, run `npm install` to install dependencies.
1. Then run `npm run start.watch` to start the Worker and leave it running.
1. If you want to run the newsletter automation workflow only once and immediately, run `npm run workflow` in another shell to run the Workflow Client.
1. If you want to run the scheduled workflow that sends the emails everyday at 9AM, run `npm run schedule.start`.

The Workflow should work after following those steps by first fetching the news from [newsapi.org](https://newsapi.org/) then generating the newsletter email template and sending it out.

In this README file, I will be providing details of the implementation steps and any notes/assumptions made.

### Architecture

This project contains 4 main files that handle the Temporal workflow; activity.ts, client.ts, workflows.ts, worker.ts.

#### 1. activity.ts

This file contains a method called `sendNewsletter` which contains the actual logic of the project. It is divided into 3 parts. The first part is fetching the news through the API. The API call is specific for fetching the top 20 headline and news about Egypt only. This is specified by adding `top-headlines?country=eg` to the API call. 

![Fetch](/Screenshots/fetchNews.png)

The next 2 parts are responsible for the email generation and sending. The first part configures the OAuth2 standard to allow our application to access the dedicated Gmail account `yodawynewsletter@gmail.com` and send the newsletters to the users from it. 

![OAuth2](/Screenshots/ConfigureOAuth2.png)

The sencond part is sending the email itself, which is done using Nodemailer. The recipients of the mail are statically defined in the code inside `emails.json`. In case you want to test receiving the email on your personal email, simply add it to the `emails.json` file following the same format as shown in the snapshot below. 

![MailList](/Screenshots/emailsJson.png)

In a proper scenario, the emails would be fetched from the database instead of being fetched from a JSON file, however, for the sake of simplicity and due to shortage of time, the JSON file mimics the return value from the database when we try to fetch all registered emails assuming the database would have a table for all emails who have subscribed to the newsletter.


The template of the email itself is defined in `/templates/newsletterTemplate.ts` which is the HTML template that makes up the way the email looks like and what information it includes.

#### 2. client.ts

This file is what puts the workflow we want to run on the task queue in order to be run by the worker.

#### 3. workflow.ts

In this file, we define our workflows by specifying which activities should run for each specific workflow. We also specify some configurations for the workflow like startToCloseTimeout which is the time limit that the Activity has to begin within before it times out. 

#### 4. worker.ts

This is the file the fires when we run `npm run workflow`. It creates a worker instance with the workflows from workflow.ts, activities from activities.ts file and the taskQueue of the activities and runs this created worker. A Worker hosts Workflow and Activity functions and executes them one at a time. The Temporal Server tells the Worker to execute a specific function from information it pulls from the Task Queue. After the Worker runs the code, it communicates the results back to the Temporal Server.

An additional funtionality of this file is defining a mini express app that is responsible for the unsubscription flow as show in the below screenshot. The unsubscription flow will be discussed in details in what follows.

![Express](/Screenshots/expressWorker.png)

* Shows the part of `worker.ts` file that is resposnbile for the unsubscription feature which will be discussed later on.

### Schedule

Since the main aim of this task was creating a scheduled workflow which runs automatically at 9AM instead of having a workflow that is fired manually each and every time, this is where the need for Temporal schedules arised. In order to achieve this, I added 5 important files that handle the scheduling of the newsletter workflow, which are; `start-schedule.ts`, `delete-schedule.ts`, `pause-schedule.ts`, `unpause-schedule.ts` and `go-faster.ts`. Each will be discussed breifly in what follows.

***1. start-schedule.ts***

This is the most importatnt file of them where the schedule instance is explicitly created. This instance contains which workflow is this schedule for, schedule ID, policies of the schedule and when should this schedule run. In our case, I specified that it should run everyday at 9AM. 

***Important note***

Since the timezone of Temporal.io is UTC, and Egypt's time is UTC+02:00, I had to specify the hour of the schedule as 7 instead of 9 to account for that time difference and to receive the emails at 9AM Egypt's time.

The command to run the schedule is `npm run schedule.start` which fires the start-schedule.ts file.

![Schedule](/Screenshots/scheduleConfig.png)

* Configuring the scheduler of the newsletter workflow
* Notice -> hour:7

#### 2. delete-schedule.ts

This file runs through the command `npm run schedule.delete` which is responsible for deleting the schedule from the Temporal Web UI and stoping its execution.

#### 3. pause-schedule.ts

This file runs through the command `npm run schedule.pause` which is responsible for pausing the schedule by only stopping its execution but not temporarily deleting it.

#### 4. unpause-schedule.ts

This file runs through the command `npm run schedule.unpause` which unpauses an already paused schedule.

#### 5. go-faster.ts

This file runs through the command `npm run schedule.go-faster` which is responsible for changing the time specification of the schedule to change it to run every 30 seconds instead of everyday at 9 AM. This is just for demonstartion purposes and was not one of the requirments of the task.

### Unsubscription Task

Due to shortage of time, I wasn't able to properly implement this module. However, I wanted to do the best I can in demonstrating how it should be like, that's why I implemented it in a simplistic way for demonstartion. I will discuss this implementation and how it should be modified in this section.

#### Implemented flow

In order to unsubscribe, you will find a link at the bottom of every email that says `Unsubscribe`. Once you click on this link, you will be redirected to `localhost:3000/` where the route for `get('/')` from `worker.ts` file shown below will be fired. What this route does is that it renders a very simple unsubscription page where you will be prompted to type the email address you want to unsubscribe for and press `Unsubscribe` as demonstrated in the below screenshot 

![MailList](/Screenshots/routes.png)

* Routes for unsubscription.

![MailList](/Screenshots/unsubscribeView.png)

* Frontend view at `localhost:3000` that opens up when you click on `Unsubscribe` from the received email.

When you click `Unsubscribe`, what happens is that the `post('/')` route is called and the flow goes as follows. All the registered emails from `emails.json` are read, and the email send through the POST request is searched for within the emails from `emails.json` and is deleted from `emails.json` once a match is found. Which means, the next time the workflow fires, the email will not be present in `emails.json` and hence it will not be part of the mail list that receives the email via node mailer the next time the email is sent out. If you try it out with an email written inside `emails.json`, you will see that it disappears if you click `Unsubscribe`.

### Proper Implementation

The proper way to implement this feature can be as follows. Basically, the `emails.json` file mimics the result of a fetchAll query from the applications database, that returns all registered emails for the newsletter. Hence, for the unsubscription flow, what should actually happen is that we remove from the database the email that is requesting the unsubscription. And hence, the next time we fetch all emails to send them the newsletter at 9 AM, the email that unsubscribed will no longer be there and will not receive the email.

A possible database coule be MongoDB, since we do not have a very complex logic that requires a relational database. Hence a NoSQL database will be sufficuent for our purpose here as we only need a table for all emails that are registered for the newsletter.

### Example runs and outputs screenshots

In this section I will be providing you with tests carried out to ensure the functionality works as expected along with screenshots for demonstration.

#### 1. Initial state of Temporal Web UI

Here you can see how Temporal's web UI looks like when we first start it using the `temporal server start-dev` command. Initially, there are no workflows or schedules.

![Initial](/Screenshots/initialWorkflows.png)
![Initial](/Screenshots/InitialSchedules.png)

#### 2. Running the workflow without scheduling

By running the command in the terminal, the workflow is created and executed. It then shows in the Web UI of Temporal Server. If the execution was successful, the status of the workflow is `Completed`.

![Run](/Screenshots/TerminalRunWorkflow.png)

* Terminal command to run the workflow

![Run](/Screenshots/UIRunWorkflow.png)
![Run](/Screenshots/UIRunWorkflow2.png)

#### 3. Running the scheduler

By running the command shown in the first screenshot below in the terminal, the schedule of the workflow is created and shows on the web UI. The workflow will fire at the specific time specified in the schedule, which is in our case at 9AM Egypt time (7 AM UTC). It is also shown in the screenshot that we have a list of some of the upcoming runs of the workflow, which shows that our scheduler is indeed working everyday at 9AM as shown by the dates and times of the upcoming runs. When a run successfully happens, it shows in the recent runs section as shown in the 4th screesnhot below. 

![Run](/Screenshots/TerminalRunSchedule.png)

* Terminal command to begin the schedule

![Run](/Screenshots/UIRunSchedule.png)
![Run](/Screenshots/UIRunSchedule2.png)

* Before any run happens

![Run](/Screenshots/ScheduleRun.png)

* Result after 1 run of the scheduled workflow

#### 4. Email template

The main components for each news piece in the newsletter email are the title, author, publish date, description and image. Sometimes, not all those fields exist from the result of the newsAPI call. Hence, I only include the ones that exist. Note that the title of each news piece is actually a hyperlink that whenever is clicked, it navigates you to the original news website that has this news piece so that you can read the full article.


***Note***

Most of the time, the result of the API call to news about Egypt does not include neither a description nor an imageUrl (both equal to null). That's why you will find the email received often only includes the title, author and publish date. However, for demonstration purposes in case you want to see how the email looks like when all fields exist, I created a hardcoded commented `fetchedNews` variable in activities.ts file that is of the same format as the return value of the API but with news other than that of Egypt (obtained from newsapi.org website). It contains only 3 pieces of news. If you want to test with this `fetchedNews` static variable instead of actually fetching Egypt's news using the API, comment out the API call and uncomment the hardcoded fetchedNews variable. This way, the automated email will contain the hardcoded fetchedNews that contains all 5 fields. An alternative way if you don't want to use static code is to change the API call through the `NEWS_API_URL` variable in .env to have `country=us` instead of `country=eg` because apparently US news often contains images and description, unlike Egypt news.

![Template](/Screenshots/DynamicEmail.png)
![Template](/Screenshots/DynamicEmail1.png)
![Template](/Screenshots/DynamicEmail2.png)

* Email resulting from fetching news from Egypt, lacking images and descriptions.

![Template](/Screenshots/StaticEmail1.png)
![Template](/Screenshots/StaticEmail2.png)
![Template](/Screenshots/StaticEmail3.png)

* Email resulting from static coded news, with images and descriptions for demonstration.



### Conclusion

This project was very intersting to work on and exposed me to new tools that I wasn't very much aware of like Temporal.io. I would definetly explore more this area of scheduled workflows and experiment with other different use cases to further benefit from this task and what it paved the way for. I hope my explanation of the implementation and flow was clear and that all the requirements were fullfilled. 

Looking forward to hearing you feedback!


