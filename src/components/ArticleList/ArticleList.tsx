// src/components/ArticleList.tsx
import React from 'react';

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    author: string;
    source: { name: string };
}

interface ArticleListProps {
    articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
    return (
        <div>
            <h2>Articles</h2>
            <ul>
                {articles.map(article => (
                    <li key={article?.id}>
                        <a href={article?.url} target="_blank" rel="noopener noreferrer">{article?.title}</a>
                        <p>{article?.description}</p>
                        <p>{article?.author} - {article?.source.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArticleList;
