import { ArticleTranslation } from './article-translation';

export interface ArticleEntry {
    spotlight: boolean;
    translations: Map<string, ArticleTranslation>;
    changelog: string[];
    edited: Date;
}
