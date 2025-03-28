import React from 'react';
import Dashboard from '../components/Dashboard2.jsx';
import {
  AiOutlineBulb,
  AiOutlineAudio,
  AiOutlinePieChart,
  AiOutlineDollarCircle,
  AiOutlineSync,
  AiOutlineBarChart,
} from "react-icons/ai";


const testimonials = [
  {
    name: 'Roy',
    text: 'The app works intuitively, it makes it super easy to control your money. It helps me to develop healthy spending habits.',
  },
  {
    name: 'Marek',
    text: 'I am using this app for more than two years and I could not be happier with the service I got.',
  },
  {
    name: 'Harnet',
    text: "I've tried other money tracking apps before Spendee, but I choose to stick to this because of its simplicity and intuitive design.",
  },
];

const governmentLinks = [
  {
    name: 'Inland Revenue Department (IRD)',
    image: './Ird.png',
    url: 'https://www.ird.gov.lk',
  },
  {
    name: 'Ministry of Finance',
    image: './Mof.png',
    url: 'https://www.treasury.gov.lk',
  },
  {
    name: 'Government Services and Information',
    image: './Gweb.png',
    url: 'https://www.gov.lk',
  },
];

const Home = () => {
  return (
    <Dashboard>
      <div className="text-2xl font-semibold text-gray-800 mb-4 px-4">Home</div>

      <div className="px-4 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-6">Features our users love</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlineBulb className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">AI Tax Prediction</h3>
            <p className="text-gray-600">
              Get real-time tax estimations based on your income, expenses, and Sri Lankan tax slabs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlineAudio className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Voice-Based Entry</h3>
            <p className="text-gray-600">
              Speak your income or expenses. No need to type – just talk and we record it for you.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlinePieChart className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Smart Expense Categorization</h3>
            <p className="text-gray-600">
              Automatically classifies your expenses and incomes into the right categories using AI.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlineDollarCircle className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Tax-Saving Tips</h3>
            <p className="text-gray-600">
              Get personalized suggestions to reduce your annual tax burden with AI-powered insights.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlineSync className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Auto Income/Expense Sync</h3>
            <p className="text-gray-600">
              Sync all income and expense entries with assets and liabilities automatically.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <AiOutlineBarChart className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Visual Tax Reports</h3>
            <p className="text-gray-600">
              Download detailed annual tax reports with breakdowns, graphs, and category-wise summaries.
            </p>
          </div>
        </div>
      </div>


      {/* Official Tax Section */}
      <div className="px-4 mb-10">
        <h2 className="text-xl font-bold text-blue-700 mb-6">
          The official tax related website in Sri Lanka
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {governmentLinks.map((site, index) => (
            <a
              key={index}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <img
                src={site.image}
                alt={site.name}
                className="w-64 h-64 object-contain mb-4"
              />
              <span className="text-center font-medium text-gray-800 hover:text-blue-600">
                {site.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Customer Comments */}
      <div className="px-4">
        <h2 className="text-xl font-bold text-blue-700 mb-6">Customer Comments</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[20px] border-t-transparent border-l-[30px] border-l-white"></div>

              <p className="text-gray-600 mb-4 leading-relaxed">{item.text}</p>
              <p className="font-semibold text-gray-800">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Dashboard>
  );
};

export default Home;
