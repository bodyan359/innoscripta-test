// src/components/ArticleCard.tsx
import React from 'react';
import { Card } from 'antd';
import { Article } from '../../types.ts';

interface ArticleCardProps {
    article: Article | any;
    loading: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, loading }) => {
    return (
        <Card title={article?.title} bordered={true} loading={loading}>
            <p>{article?.description?.length > 0 ? article.description : `No description provided.`}</p>
            <p>---</p>
            <p>{article?.author} - {article?.source?.name}</p>
            <p><a href={article?.url} target="_blank" rel="noopener noreferrer">Read more...</a></p>
        </Card>
    );
};

export default ArticleCard;
