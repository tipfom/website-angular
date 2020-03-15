import { ArticleFile } from './article-file';

export interface ArticleEntry {
    name: string;
    creation_time: string;
    title_de: string;
    title_en: string;
    description_de: string;
    description_en: string;
    files: ArticleFile[][];
}
