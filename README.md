# Yodawy Hiring Task

This project was implemented in compliance to the requirments mentioned in Yodawy's newsletter application task document. The base of the project is scaffolded out from running `npx @temporalio/create@latest ./myfolder`, with the addition of extra functionalities specific for the task requirments.

### Running this project

1. Clone the project into your local machine.
1. Create a .env file in the root directory and paste in it the the provided .env file content sent in the submission email.
1. In your terminal, run `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation) and leave it running.
1. In another shell, run `npm install` to install dependencies.
1. Then run `npm run start.watch` to start the Worker and leave it running.
1. If you want to run the newsletter automation workflow only once and immediately, run `npm run workflow` in another shell to run the Workflow Client.
1. If you want to run the scheduled workflow that sends the emails everyday at 9AM, run `npm run schedule.start`.

The Workflow should work after following those steps by first fetching the news from [newsapi.org](https://newsapi.org/) then generating the newsletter email template and sending it out.

In this README file, I will be providing details of the implementation steps and any notes/assumptions made.

### Architecture

This project contains 4 main files that handle the Temporal workflow; activity.ts, client.ts, workflows.ts, worker.ts.

#### 1. activity.ts

This file contains a method called `sendNewsletter` which contains the actual logic of the project. It is divided into 3 parts. The first part is fetching the news through the API. The API call is specific for fetching the top 20 headline and news about egypt only. This is specified by adding `top-headlines?country=eg` to the API call. 

IMAGE1

The next 2 parts are responsible for the email generation and sending. The first part configures the OAuth2 standard to allow our application to access the dedicated Gmail account `yodawynewsletter@gmail.com` and send the newsletters to the users from it. 

IMAGE2

The sencond part is sending the email itself, which is done using Nodemailer. The recipients of the mail are statically defined in the code (mailList array) in case you want to change them to test receiving the email on your personal email. 

IMAGE3+MAILLIST IMG

The template of the email itself is defined in `/templates/newsletterTemplate.ts` which is the HTML code that makes up the way the email looks like and what information it includes.

#### 2. client.ts

This file is what puts the workflow we want to run on the task queue in order to be run by the worker.

#### 3. workflow.ts

In this file, we define our workflows by specifing which activities should run for each specific workflow. We also specify some configurations for the workflow like startToCloseTimeout which is the time limit that the Avtivity has to begin within before it times out. 

#### 4. worker.ts

This is the file the fires when we run `npm run workflow`. It creates a worker instance with the workflows from workflow.ts, activities from activities.ts file and the taskQueue of the activities and runs this created worker. A Worker hosts Workflow and Activity functions and executes them one at a time. The Temporal Server tells the Worker to execute a specific function from information it pulls from the Task Queue. After the Worker runs the code, it communicates the results back to the Temporal Server.

### Schedule

Since the main aim of this task was creating a scheduled workflow which runs automatically at 9AM instead of having a workflow that is fired manually each and every time, this is where the need for Temporal schedules arised. In order to achieve this, I added 5 important files that handle the scheduling of the newsletter workflow, which are; `start-schedule.ts`, `delete-schedule.ts`, `pause-schedule.ts`, `unpause-schedule.ts` and `go-faster.ts`. I will discuss each of the breifly in what follows.

***1. start-schedule.ts***

This is the most importatnt file of them where I explicitly create the schedule instance. This instance contains which workflow is this schedule for, schedule ID, policies of the schedule and when should this schedule run. In our case, I specificed that it should run everyday at 9AM. 

***Note***

Since the timezone of Temporal.io is UTC, and Egypt's time is UTC+02:00, I had to specify the hour of the schedule as 7 instead of 9 to account for that time difference and to receive the emails at 9AM Egypt's time.

The command to run the schedule is `npm run schedule.start` which fires this start-schedule.ts file.

IMAGE 4

#### 2. delete-schedule.ts

This file runs through the command `npm run schedule.delete` which is responsible for deleting the schedule from the Temporal Web UI and stoping its execution.

#### 3. pause-schedule.ts

This file runs through the command `npm run schedule.pause` which is responsible for pausing the schedule by only stopping its execution but not temporarily deleting it.

#### 4. unpause-schedule.ts

This file runs through the command `npm run schedule.unpause` which unpauses and already pause schedule.

#### 5. go-faster.ts

This file runs through the command `npm run schedule.go-faster` which is responsible changing the time specification of the schedule to change it to run every 30 seconds instead of everyday at 9 AM. This is just for demonstartion purposes and was not one of the requirments of the task.

### Example runs and outputs screenshots

In this section I will be providing you with tests carried out to ensure the functionality works as expected along with screenshots for demonstration.

#### 1. Initial state of Temporal Web UI

Here you can see how Temporal's web UI looks like when we first start it using the `temporal server start-dev` command. Initially, there are no workflows or schedules.

#### 2. Running the workflow without scheduling

By running the command in the terminal, the workflow is created and executed. It then shows in the Web UI. If the execution was successful, the status of the workflow is `Completed`

#### 3. Running the scheduler

By running the command in the terminal, the schedule of the workflow is created and shows on the web UI. The workflow will fire at the specific time specificed in the schedule, which is in our case at 9AM Egypt time (7 AM UTC). It is also shown in the screenshot that we have a list of some of the upcoming runs of the workflow, which shows that our scheduler is indeed working everyday at 9AM as shown by the dates and times of the upcoming runs. When a run successfully happens, it shows in the recent runs section.

#### 4. Email template

The main components for each news piece in the newsletter email are the title, author, publish date, description and image. Sometimes, not all those fields exist from the result of the newsAPI call. Hence, I only include the ones that exist. Note that the title of each news piece is actually a hyperlink that whenever is clicked, it navigates you to the original news website that has this news piece sp that you can read the full article.

***Note***

Most of the time, the result of the API call to news from Egypt does not include neither a description nor an imageUrl (both equal to null). That's why you will find the email received often only includes the title, author and publish date. However, for demonstration purposes in case you want to see the output when all fields exist, I created a hardcoded commented `fetchedNews` variable in activities.ts file that is of the same format as the return value of the API but with news other than that of Egypt (obtained from newsapi.org website). If you want to test with this `fetchedNews` static variable instead of actually fetching Egypt's news using the API, comment out the API call and uncomment the hardcoded fetchedNews variable. This way, the automated email will contain the hardcoded fetchedNews that contains all 5 fields. An alternative way if you don't want to use static code is to change the API call through the `NEWS_API_URL` variable in .env to have `country=us` instead of `country=eg` because apparently US news often contain images and description, unlike Egypt news.

### Conclusion

This project was very intersting to work on and exposed me to new tools that I wasn't very much aware of like Temporal.io. I would definetly explore more this area of scheduled workflows and experiment with other different use cases to further benefit from this task and what it paved the way for. I hope my explanation of the implementation and flow was clear and that all the requirements were fullfilled. 

Looking forward to hearing you feedback!


