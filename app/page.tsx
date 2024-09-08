"use client";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBitcoin, FaEthereum, FaRegChartBar } from 'react-icons/fa';

// NewsTicker Component
const NewsTicker: React.FC<{ newsList: any[] }> = ({ newsList }) => {
  return (
    <div className="news-ticker-container">
      <div className="news-ticker-wrapper">
        {newsList.map((news, index) => (
          <div key={index} className="news-ticker-item">
            {news.urlToImage && <img src={news.urlToImage} alt="News thumbnail" className="news-ticker-image" />}
            <div className="news-ticker-content">
              <a href={news.url} target="_blank" rel="noopener noreferrer" className="news-ticker-title">
                {news.title}
              </a>
              <p className="news-ticker-description">{news.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const [news, setNews] = useState<any[]>([]);

  const fetchNews = async () => {
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "us",
          category: "business",
          apiKey: "eaf46a4c3e284ed89957524dd2c03c41", // Replace with your News API key
        },
      });
      setNews(response.data.articles.slice(0, 8)); // Get the top 8 news articles
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Crypto Exchange - Trade Anytime, Anywhere</title>
        <meta name="description" content="Your Gateway to Global Crypto Markets." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center h-[550px] bg-gradient-to-r from-blue-900 to-purple-900 text-center">
        <h1 className="text-5xl font-bold mb-4">Trade Crypto. Anytime. Anywhere.</h1>
        <p className="text-lg mb-6">Your Gateway to Global Crypto Markets</p>
        <div className="space-x-4">
          <button className="px-8 py-4 bg-blue-600 rounded-lg hover:bg-blue-500">
            Sign Up Now
          </button>
          <button className="px-8 py-4 bg-green-600 rounded-lg hover:bg-green-500">
            Explore Markets
          </button>
        </div>
      </section>

      <section id="news" className="py-20 bg-gray-900">
        <h2 className="text-4xl font-semibold text-center mb-10">Latest News</h2>
        <NewsTicker newsList={news} />
      </section>


      {/* Features Section */}
      <section className="py-10">
        <h2 className="text-4xl font-semibold text-center mb-10 mt-[-40px]">Why Trade with Us?</h2>
        <div className="flex justify-center space-x-8">
          <Feature
            icon={<FaRegChartBar size={50} />}
            title="Real-Time Trading"
            description="Instant execution, no delays."
          />
          <Feature
            icon={<FaBitcoin size={50} />}
            title="Secure Transactions"
            description="Top-tier security for all transactions."
          />
          <Feature
            icon={<FaEthereum size={50} />}
            title="Low Fees"
            description="Trade with the lowest fees on the market."
          />
        </div>
      </section>

      {/* Crypto Market Overview */}
      <section className="py-20 bg-gray-800">
        <h2 className="text-4xl font-semibold text-center mb-10">Live Crypto Prices</h2>
        <div className="flex justify-center space-x-8">
          <MarketCard coin="BTC" price="49,000" change="+2.3%" />
          <MarketCard coin="ETH" price="3,400" change="-1.2%" />
          <MarketCard coin="SOL" price="150" change="+5.5%" />
        </div>
      </section>

      {/* News Section */}

      {/* How It Works */}
      <section className="py-20">
        <h2 className="text-4xl font-semibold text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-3 gap-6">
          <StepCard step="1" title="Sign Up" description="Register an account with easy KYC." />
          <StepCard step="2" title="Fund Your Account" description="Deposit using multiple payment options." />
          <StepCard step="3" title="Start Trading" description="Trade seamlessly with instant execution." />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-800 text-center">
        <p>&copy; 2024 Crypto Exchange - All Rights Reserved</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
        </div>
      </footer>

    </div>
  );
}

// Feature component
//@ts-ignore
const Feature = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="mb-4 text-blue-500">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

// Market Card component
//@ts-ignore
const MarketCard = ({ coin, price, change }) => (
  <div className="bg-gray-700 p-6 rounded-lg text-center">
    <h3 className="text-xl font-semibold">{coin}</h3>
    <p className="text-3xl font-bold">${price}</p>
    <p className={change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>{change}</p>
  </div>
);

// Step Card component
//@ts-ignore
const StepCard = ({ step, title, description }) => (
  <div className="bg-gray-700 p-6 rounded-lg text-center">
    <h3 className="text-4xl font-bold mb-2">{step}</h3>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-400">{description}</p>
  </div>
);

