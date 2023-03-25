import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { sendNewsletter } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export async function newsletterWorkflow(): Promise<string> {
  return await sendNewsletter();
}
