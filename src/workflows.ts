import { proxyActivities } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { sendNewsletter } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

/** A workflow that simply calls an activity */
// export async function example(name: string): Promise<string> {
//   return await greet(name);
// }

export async function newsletterWorkflow(): Promise<string> {
  return await sendNewsletter();
}
