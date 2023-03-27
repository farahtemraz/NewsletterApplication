/* eslint-disable @typescript-eslint/no-var-requires */
import { Connection, Client, ScheduleOverlapPolicy } from '@temporalio/client';
import { newsletterWorkflow } from './workflows';

async function run() {
  const client = new Client({
    connection: await Connection.connect(),
  });

  // https://typescript.temporal.io/api/classes/client.ScheduleClient#create
  const schedule = await client.schedule.create({
    action: {
      type: 'startWorkflow',
      workflowType: newsletterWorkflow,
      taskQueue: 'hello-world',
    },
    scheduleId: 'newsletter-schedule',
    policies: {
      catchupWindow: '1 day',
      overlap: ScheduleOverlapPolicy.ALLOW_ALL,
    },
    spec: {
      calendars: [
        {
          comment: 'Everyday at 9AM UTC+02:00, 7AM',
          dayOfWeek: '*',
          hour: 7,
        },
      ],
    },
  });

  console.log(`Started schedule '${schedule.scheduleId}'.
The newsletter Workflow will run everyday at 9AM.
You can now run:
  npm run schedule.go-faster
  npm run schedule.pause
  npm run schedule.unpause
  npm run schedule.delete
  `);

  await client.connection.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
