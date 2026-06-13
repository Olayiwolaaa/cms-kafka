// cms/articleService.ts
import { v4 as uuidv4 } from 'uuid';
import { publishArticleEvent } from "../kafka/producer";

export async function createArticle(
    title: string,
    authorId: string,
    body: string
): Promise<string> {
    const articleId = uuidv4();
    await publishArticleEvent(articleId, {
        eventType: 'ArticleCreated',
        payload: { title, authorId, body },
    });
    return articleId;
}

export async function updateArticle(
    articleId: string,
    newTitle: string,
    body: string
): Promise<void> {
    await publishArticleEvent(articleId, {
        eventType: 'ArticleUpdated',
        payload: { newTitle, body },
    });
}

export async function publishArticle(articleId: string): Promise<void> {
    await publishArticleEvent(articleId, {
        eventType: 'ArticlePublished',
        payload: { publishedAt: new Date().toISOString() },
    });
}

export async function deleteArticle(
    articleId: string,
    reason: string
): Promise<void> {
    await publishArticleEvent(articleId, {
        eventType: 'ArticleDeleted',
        payload: { reason },
    });
}