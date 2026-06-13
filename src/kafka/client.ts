import { Kafka, logLevel } from 'kafkajs';

export const kafka = new Kafka({
    clientId: 'cms-kafka',
    brokers: ['localhost:9092'],
    logLevel: logLevel.WARN,
});