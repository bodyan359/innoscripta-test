/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Input, Select, Button } from 'antd';
import ArticleCard from './ArticleCard/ArticleCard.tsx';
import { Article } from '../types.ts';

const { Option } = Select;

const App: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<any>('2024-01-01');
    const [categoryFilter, setCategoryFilter] = useState<any>('information technology');
    const [sourceFilter, setSourceFilter] = useState<string[]>(["newsApiResponse"]);

    useEffect(() => {
        fetchArticles();
    }, [searchQuery, dateFilter, categoryFilter, sourceFilter]);

    const fetchArticles = async () => {
        try {
            const country = 'us';
            const newsApiEndpoint: string = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${import.meta.env.VITE_NEWSAPI_API_KEY}`;
            const newsApiAIApiEndpoint: string = `https://newsapi.ai/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22conceptUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2F${categoryFilter}%22%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%7D%7D&resultType=articles&articlesSortBy=date&apiKey=${import.meta.env.VITE_NEWSAPIAI_API_KEY}`;
            const NYTimes_ApiEndpoint: string = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryFilter}&api-key=${import.meta.env.VITE_NYTIMES_API_KEY}`;

            const [newsApiResponse, newsApiAIApiResponse, NYTimesApiResponse] = await Promise.allSettled([
                axios.get(newsApiEndpoint),
                axios.get(newsApiAIApiEndpoint),
                axios.get(NYTimes_ApiEndpoint)
            ]);
            let filteredArticles: any[] = [];

            if (sourceFilter.includes('newsApiResponse')) {
                filteredArticles = [...filteredArticles, ...(newsApiResponse.status === 'fulfilled' ? newsApiResponse.value.data?.articles ?? [] : [])];
            }
            if (sourceFilter.includes('newsApiAIApiResponse')) {
                filteredArticles = [...filteredArticles, ...(newsApiAIApiResponse.status === 'fulfilled' ? newsApiAIApiResponse.value.data?.articles?.results ?? [] : [])];
            }
            if (sourceFilter.includes('NYTimesApiResponse')) {
                filteredArticles = [...filteredArticles, ...(NYTimesApiResponse.status === 'fulfilled' ? NYTimesApiResponse.value.data?.response?.docs ?? [] : [])];
            }


            setArticles(filteredArticles);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching articles:', error);
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchArticles();
    };

    return (
        <div className="App">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Input placeholder="Enter keywords" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </Col>
                <Col>
                    <Select placeholder="Select date" value={dateFilter} onChange={(value) => setDateFilter(value)}>
                        <Option value="2024-01-01">2024-01-01</Option>
                        <Option value="2023-01-01">2023-01-01</Option>
                        <Option value="2022-01-01">2022-01-01</Option>
                    </Select>
                </Col>
                <Col>
                    <Select placeholder="Select category" value={categoryFilter} onChange={(value) => setCategoryFilter(value)}>
                        <Option value="business">Business</Option>
                        <Option value="information technology">Information Technology</Option>
                        <Option value="science">Science</Option>
                        <Option value="health">Health</Option>
                        <Option value="sports">Sports</Option>
                    </Select>
                </Col>
                <Col>
                    <Select mode={"multiple"} placeholder="Search by source"  value={sourceFilter} onChange={(value) => setSourceFilter(value)}>
                        <Option value="newsApiResponse">NewsAPI</Option>
                        <Option value="newsApiAIApiResponse">NewsAPI AI</Option>
                        <Option value="NYTimesApiResponse">NY Times</Option>
                    </Select>
                </Col>
                <Col span={24}>
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                </Col>
                {loading ? <div>Loading...</div> : (
                    articles.map((article, artKey) => (
                        <Col key={artKey} xs={24} sm={24} md={24} lg={12}>
                            <ArticleCard article={article} loading={false} />
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default App;