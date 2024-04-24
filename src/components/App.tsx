import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleList from './ArticleList/ArticleList.tsx';

const App: React.FC = () => {
    const [articles, setArticles] = useState<any>([]);

    console.log('Y',import.meta.env)

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('YOUR_NEWS_API_ENDPOINT_HERE');
                setArticles(response.data.articles);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="App">
            <ArticleList articles={articles} />
        </div>
    );
};

export default App;
