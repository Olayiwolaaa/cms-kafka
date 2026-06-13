export interface EventEnvelope<T extends string, P> {
    eventId: string;
    eventType: T;
    aggregateId: string;
    occurredAt: string;
    payload: P;
}

export type ArticleCreatedEvent = EventEnvelope<'ArticleCreated', {
    title: string;
    authorId: string;
    body: string;
}>;

export type ArticleUpdatedEvent = EventEnvelope<'ArticleUpdated', {
    title?: string;
    body?: string;
}>;

export type CommentAddedEvent = EventEnvelope<'CommentAdded', {
    commentId: string;
    authorId: string;
    content: string;
}>;

export type ArticlePublishedEvent = EventEnvelope<'ArticlePublished', { publishedAt: string }>;

export type ArticleDeletedEvent = EventEnvelope<'ArticleDeleted', { reason: string }>;

export type ArticleEvent = ArticleCreatedEvent | ArticleUpdatedEvent | ArticlePublishedEvent | ArticleDeletedEvent;