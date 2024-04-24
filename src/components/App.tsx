import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import ArticleCard from './ArticleCard/ArticleCard.tsx';
import { Article } from '../types.ts';

const App: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const country = 'us'
                // const newsApiEndpoint: string = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${import.meta.env.VITE_NEWSAPI_KEY}`;
                const newsApiAIApiEndpoint: string = `https://newsapi.ai/api/v1/event/getEvents?query=%7B%22%24query%22%3A%7B%22conceptUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FInformation_technology%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=events&eventsSortBy=date&eventImageCount=1&includeConceptLabel=false&includeConceptDescription=true&storyImageCount=1&apiKey=${import.meta.env.VITE_NEWSAPIAI_KEY}`;
                const NYTimes_ApiEndpoint: string = `https://newsapi.ai/api/v1/event/getEvents?query=%7B%22%24query%22%3A%7B%22conceptUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FInformation_technology%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=events&eventsSortBy=date&eventImageCount=1&includeConceptLabel=false&includeConceptDescription=true&storyImageCount=1&apiKey=${import.meta.env.VITE_NEWSAPIAI_KEY}`;
                const response = await axios.get(newsApiAIApiEndpoint);
                console.log(response.data?.events?.results)
                setArticles(response.data?.events?.results);
                setTimeout(()=> setLoading(false), 500)
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="App">
            <Row gutter={[16, 16]}>
                {articles.map((article, artKey) => (
                    <Col key={artKey} xs={24} sm={24} md={24} lg={12}>
                        <ArticleCard article={article} loading={loading}/>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default App;
