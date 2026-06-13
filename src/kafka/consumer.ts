import { kafka } from './client';
import { TOPICS } from '../events/topics';
import { ArticleEvent } from '../events/types';
import { applyEvent } from '../cms/projections';

const consumer = kafka.consumer({
  groupId: 'cms-projections',
});

export async function startConsumer(): Promise<void> {
  await consumer.connect();
  console.log('[consumer] connected');

  await consumer.subscribe({
    topic:     TOPICS.ARTICLES,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      let event: ArticleEvent;
      try {
        event = JSON.parse(message.value.toString()) as ArticleEvent;
      } catch (err) {
        console.error('[consumer] failed to parse message', message.value.toString());
        return;
      }

      try {
        await applyEvent(event);
        console.log(
          `[consumer] applied ${event.eventType} | partition=${partition} offset=${message.offset}`
        );
      } catch (err) {
        console.error('[consumer] error applying event', err);
      }
    },
  });
}