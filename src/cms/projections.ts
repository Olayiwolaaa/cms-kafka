import { ArticleEvent } from '../events/types';

export interface ArticleModel {
  id:          string;
  title:       string;
  authorId:    string;
  body:        string;
  status:      'draft' | 'published' | 'deleted';
  publishedAt: string | null;
  updatedAt:   string;
}

const articles = new Map<string, ArticleModel>();

export function getArticle(id: string): ArticleModel | undefined {
  return articles.get(id);
}

export function getAllArticles(): ArticleModel[] {
  return [...articles.values()];
}

export async function applyEvent(event: ArticleEvent): Promise<void> {
  switch (event.eventType) {
    case 'ArticleCreated': {
      articles.set(event.aggregateId, {
        id:          event.aggregateId,
        title:       event.payload.title,
        authorId:    event.payload.authorId,
        body:        event.payload.body,
        status:      'draft',
        publishedAt: null,
        updatedAt:   event.occurredAt,
      });
      break;
    }
    case 'ArticleUpdated': {
      const article = articles.get(event.aggregateId);
      if (!article) {
        console.warn('[projection] ArticleTitleUpdated for unknown article', event.aggregateId);
        return;
      }
      articles.set(event.aggregateId, {
        ...article,
        title:     event.payload.newTitle,
        updatedAt: event.occurredAt,
      });
      break;
    }
    case 'ArticlePublished': {
      const article = articles.get(event.aggregateId);
      if (!article) return;
      articles.set(event.aggregateId, {
        ...article,
        status:      'published',
        publishedAt: event.payload.publishedAt,
        updatedAt:   event.occurredAt,
      });
      break;
    }
    case 'ArticleDeleted': {
      const article = articles.get(event.aggregateId);
      if (!article) return;
      articles.set(event.aggregateId, {
        ...article,
        status:    'deleted',
        updatedAt: event.occurredAt,
      });
      break;
    }
    default: {
      const _never: never = event;
      console.warn('[projection] unknown event type', _never);
    }
  }
}