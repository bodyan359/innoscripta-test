// src/types.ts
export interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    author: string;
    source: { name: string };
}
