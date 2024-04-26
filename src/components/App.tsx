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
    const [autoUpdate, setAutoUpdate] = useState<boolean>(false);

    useEffect(() => {
        const debouncedFetchArticles = debounce(fetchArticles, 1500);
        autoUpdate && debouncedFetchArticles();
    }, [searchQuery, dateFilter, categoryFilter, sourceFilter]);

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

                const newsApiAIApiResponse = await axios.get(`https://newsapi.ai/api/v1/article/getArticles?query=%7B%22%24query%22%3A%7B%22%24and%22%3A%5B%7B%22keyword%22%3A%22${searchQuery}%22%2C%22keywordLoc%22%3A%22title%22%7D%2C%7B%22dateStart%22%3A%22${dateFilter}%22%2C%22dateEnd%22%3A%22${dateFilter}%22%7D%5D%7D%7D&resultType=articles&articlesSortBy=date&apiKey=7e11187d-1ceb-4243-9be1-f06b5c2f487e`);

                const formattedArticles = newsApiAIApiResponse.data?.articles?.results?.map((article: any) => ({
                    title: article.title,
                    description: article.body,
                    author: article.author,
                    source: {
                        name: "NewsAPI AI"
                    },
                    url: article.url
                })) ?? [];

                filteredArticles.push(...formattedArticles);
            }

            if (sourceFilter.includes('NYTimesApiResponse')) {
                const NYTimes_ApiEndpoint = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${categoryFilter}&pub_date=${dateFilter}&api-key=${import.meta.env.VITE_NYTIMES_API_KEY}`;
                const NYTimesApiResponse = await axios.get(NYTimes_ApiEndpoint);
                const articlesFromNYTimes = NYTimesApiResponse.data?.response?.docs ?? [];

                const formattedArticlesFromNYTimes = articlesFromNYTimes.map((article: any) => ({
                    title: article?.headline?.main ?? "",
                    description: article?.abstract ?? "",
                    author: article?.byline?.original ?? "",
                    source: {
                        name: "NY Times"
                    },
                    url: article?.web_url ?? ""
                }));

                filteredArticles.push(...formattedArticlesFromNYTimes);
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
            <Row gutter={[16, 16]} style={{marginTop: '2%'}}>
                <Col xs={24}>
                    <Row>
                        <Col span={6}>
                            <label>Keywords:</label>
                        </Col>
                        <Col span={12}>
                            <Input placeholder="Enter keywords" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row>
                        <Col span={6}>
                            <label>Date:</label>
                        </Col>
                        <Col span={18}>
                            <DatePicker defaultValue={dateFilter} onChange={onChange} />
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row>
                        <Col span={6}>
                            <label>Category:</label>
                        </Col>
                        <Col span={18}>
                            <Select placeholder="Select category" value={categoryFilter} onChange={(value) => setCategoryFilter(value)}>
                                <Option value="business">Business</Option>
                                <Option value="information technology">Information Technology</Option>
                                <Option value="science">Science</Option>
                                <Option value="health">Health</Option>
                                <Option value="sports">Sports</Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24}>
                    <Row>
                        <Col span={6}>
                            <label>Search by source:</label>
                        </Col>
                        <Col span={18}>
                            <Select mode="multiple" placeholder="Search by source" value={sourceFilter} onChange={(value) => setSourceFilter(value)}>
                                <Option value="newsApiResponse">NewsAPI</Option>
                                <Option value="newsApiAIApiResponse">NewsAPI AI</Option>
                                <Option value="NYTimesApiResponse">NY Times</Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Button type="primary" onClick={handleSearch}>Search</Button>
                </Col>

                {articles.map((article, artKey) => (
                        <Col key={artKey} xs={24} sm={24} md={24} lg={12}>
                            <ArticleCard article={article} loading={loading} />
                        </Col>
                    ))}
            </Row>
        </div>
    );
};

export default App;