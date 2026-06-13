import { ArticleEvent } from "../events/types";
import { kafka } from "./client";
import { TOPICS } from "../events/topics";
import { v4 as uuidv4 } from "uuid";

const producer = kafka.producer({ allowAutoTopicCreation: false });

let connected = false;

export async function connectProducer(): Promise<void> {
  if (connected) return;
  await producer.connect();
  connected = true;
}

export async function disconnectProducer(): Promise<void> {
  await producer.disconnect();
  connected = false;
}

export async function sendMessage(
  topic: string,
  messages: { key: string; value: string }[],
  headers: Record<string, string>
): Promise<void> {
  if (!connected) throw new Error("Producer is not connected");
  await producer.send({ topic, messages: messages.map((msg) => ({ ...msg, headers })) });
}

export async function publishArticleEvent(
  articleId: string,
  event: Omit<ArticleEvent, "eventId" | "aggregateId" | "occurredAt">,
): Promise<void> {
  const fullEvent: ArticleEvent = {
    ...event,
    eventId: uuidv4(),
    aggregateId: articleId,
    occurredAt: new Date().toISOString(),
  } as ArticleEvent;

  await sendMessage(
    TOPICS.ARTICLES,
    [
      {
        key: articleId,
        value: JSON.stringify(fullEvent),
      },
    ],
    {
      eventType: fullEvent.eventType,
      schemaVersion: "1",
    },
  );

  console.log(
    `[producer] sent ${fullEvent.eventType} for article ${articleId}`,
  );
}
