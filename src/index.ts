import { connectProducer, disconnectProducer } from './kafka/producer';
import { startConsumer } from './kafka/consumer';
import {
  createArticle,
  updateArticle ,
  publishArticle,
  deleteArticle,
} from './cms/articleService';

async function main() {
  await connectProducer();
  await startConsumer();

  console.log('--- Running CMS scenario ---');

  const id = await createArticle(
    'Getting started with Kafka',
    'author-001',
    'Kafka is a distributed commit log...'
  );

  await updateArticle (id, 'Getting started with Kafka', 'Getting started with Kafka and TypeScript');
  await publishArticle(id);
  await deleteArticle(id, 'No longer relevant');

  await new Promise(r => setTimeout(r, 1000));

  const { getAllArticles } = await import('./cms/projections');


  console.log('--- Read model state ---');
  console.log(JSON.stringify(getAllArticles(), null, 2));
}

async function shutdown() {
  console.log('Shutting down gracefully...');
  await disconnectProducer();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT',  shutdown);

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});