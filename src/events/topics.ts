export const TOPICS = {
    ARTICLES: "cms.articles",
    ARTICLE_DQL: "cms.article-dql",
} as const;

export type Topic = typeof TOPICS[keyof typeof TOPICS];