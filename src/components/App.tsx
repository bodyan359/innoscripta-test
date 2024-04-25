/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Row, Col, Input, Select, Button, DatePickerProps, DatePicker} from 'antd';
import ArticleCard from './ArticleCard/ArticleCard.tsx';
import { Article } from '../types.ts';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
const { Option } = Select;

const App: React.FC = () => {
    console.log(dayjs())
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<any>(dayjs());
    const [categoryFilter, setCategoryFilter] = useState<any>('information technology');
    const [sourceFilter, setSourceFilter] = useState<string[]>(["newsApiResponse"]);

    // useEffect(() => {
    //     const debouncedFetchArticles = debounce(fetchArticles, 1500);
    //     debouncedFetchArticles();
    // }, [searchQuery, dateFilter, categoryFilter, sourceFilter]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            let filteredArticles: any[] = [];

            if (sourceFilter.includes('newsApiResponse')) {
                const API_ENDPOINT = `https://newsapi.org/v2/top-headlines?q=${searchQuery}&country=us&from=${dateFilter}&sortBy=createdAt&apiKey=${import.meta.env.VITE_NEWSAPI_API_KEY}`;
                const newsApiResponse = await axios.get(API_ENDPOINT);
                filteredArticles.push(...(newsApiResponse.data?.articles ?? []));
            }

            if (sourceFilter.includes('newsApiAIApiResponse')) {
                const APIAI_PARAMS = {
                    "query": {
                        "$query": {
                            "keyword": searchQuery,
                            "keywordSearchMode": "simple"
                        },
                        "$filter": {
                            "forceMaxDataTimeWindow": "31"
                        }
                    },
                    "resultType": "articles",
                    "articlesSortBy": "date",
                    "apiKey": import.meta.env.VITE_NEWSAPIAI_API_KEY
                };
                const newsApiAIApiResponse = await axios.get('https://newsapi.ai/api/v1/article/getArticles', { params: APIAI_PARAMS });
                filteredArticles.push(...(newsApiAIApiResponse.data?.articles?.results ?? []));
            }

            if (sourceFilter.includes('NYTimesApiResponse')) {
                const NYTimes_ApiEndpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryFilter}&api-key=${import.meta.env.VITE_NYTIMES_API_KEY}`;
                const NYTimesApiResponse = await axios.get(NYTimes_ApiEndpoint);
                filteredArticles.push(...(NYTimesApiResponse.data?.response?.docs ?? []));
            }

            setArticles(filteredArticles);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = () => {
        fetchArticles();
    };

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        setDateFilter(dateString)
    };

    return (
        <div className="App">
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Input placeholder="Enter keywords" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </Col>
                <Col>
                        <DatePicker defaultValue={dateFilter} onChange={onChange} />
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