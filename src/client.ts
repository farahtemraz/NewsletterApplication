import { Connection, Client } from '@temporalio/client';
import { newsletterWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
  const connection = await Connection.connect();
  const client = new Client({
    connection,
  });

  const handle = await client.workflow.start(newsletterWorkflow, {
    taskQueue: 'hello-world',
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
