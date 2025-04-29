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
    name: 'Ministry of Finance',
    image: './Mof2.png',
    url: 'https://www.treasury.gov.lk',
  },
  {
    name: 'Inland Revenue Department (IRD)',
    image: './Ird.png',
    url: 'https://www.ird.gov.lk',
  },
  {
    name: 'Government Services and Information',
    image: './Gweb2.png',
    url: 'https://www.gov.lk',
  },
];

const Home = () => {
  return (
    <Dashboard>
      <div className="bg-blue-50 min-h-screen">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 px-6 mb-16">
        {/* Left side - Text */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            The only app that <br />
            <span className="text-blue-700">analyzes your taxes smartly</span>
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-xl mx-auto lg:mx-0">
            Get real-time insights, AI-based savings tips, and personalized tax breakdowns with our smart Sri Lankan tax assistant.
          </p>
          <div className="flex justify-center lg:justify-start gap-4">
            <img src="/appstore.png" alt="App Store" className="h-12 hover:scale-105 transition-transform duration-300" />
            <img src="/playstore.png" alt="Play Store" className="h-12 hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

        {/* Right side - Sketchfab 3D model */}
        <div className="flex-1 w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <iframe
            title="Dual power office calculator"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            mozAllowFullScreen={true}
            webkitAllowFullScreen={true}
            allowFullScreen={false}
            className="w-full h-full"
            src="https://sketchfab.com/models/7f5cdd32581247feaf9c0d0d42b2a17f/embed?autostart=1&preload=1&transparent=1&ui_hint=0&ui_infos=0&ui_controls=0&ui_watermark=0&ui_stop=0&ui_fullscreen=0&ui_settings=0"
          ></iframe>
        </div>
      </div>

      <div className="px-6 mb-16">
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Features Our Users Love</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[{
            icon: <AiOutlineBulb className="text-blue-600 text-3xl" />, title: 'AI Tax Prediction', text: 'Get real-time tax estimations based on your income, expenses, and Sri Lankan tax slabs.'
          }, {
            icon: <AiOutlineAudio className="text-blue-600 text-3xl" />, title: 'Voice-Based Entry', text: 'Speak your income or expenses. No need to type – just talk and we record it for you.'
          }, {
            icon: <AiOutlinePieChart className="text-blue-600 text-3xl" />, title: 'Smart Expense Categorization', text: 'Automatically classifies your expenses and incomes into the right categories using AI.'
          }, {
            icon: <AiOutlineDollarCircle className="text-blue-600 text-3xl" />, title: 'Tax-Saving Tips', text: 'Get personalized suggestions to reduce your annual tax burden with AI-powered insights.'
          }, {
            icon: <AiOutlineSync className="text-blue-600 text-3xl" />, title: 'Auto Income/Expense Sync', text: 'Sync all income and expense entries with assets and liabilities automatically.'
          }, {
            icon: <AiOutlineBarChart className="text-blue-600 text-3xl" />, title: 'Visual Tax Reports', text: 'Download detailed annual tax reports with breakdowns, graphs, and category-wise summaries.'
          }].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Tax Section */}
      <div className="px-6 mb-16">
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Official Tax-Related Websites in Sri Lanka
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {governmentLinks.map((site, index) => (
            <a
              key={index}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-5 bg-blue-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-center"
            >
              <img
                src={site.image}
                alt={site.name}
                className="w-48 h-48 object-contain mb-4"
              />
              <span className="font-medium text-gray-800 hover:text-blue-600">
                {site.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Customer Comments */}
    <div className="px-6 mb-20">
      <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Customer Comments</h2>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <div
            key={index}
            className="relative bg-white p-6 pt-12 rounded-2xl shadow-md hover:shadow-lg transition"
          >
            {/* Blue user logo */}
            <div className="absolute -top-6 left-6 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A4 4 0 016.343 16h11.314a4 4 0 011.222 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            {/* Speech bubble tail */}
            <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[20px] border-t-transparent border-l-[30px] border-l-white"></div>

            <p className="text-gray-600 mb-4 leading-relaxed">{item.text}</p>
            <p className="font-semibold text-gray-800 text-right">— {item.name}</p>
          </div>
        ))}
      </div>
    </div>
    
    
      {/* Footer */}
      <footer className="bg-blue-900 text-white mt-20 py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Brand / Logo */}
          <div>
            <h3 className="text-xl font-bold mb-2">SmartTax</h3>
            <p className="text-sm text-blue-100">
              Your AI-powered tax companion for smart financial planning in Sri Lanka.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:underline text-blue-200">Home</a></li>
              <li><a href="#features" className="hover:underline text-blue-200">Features</a></li>
            </ul>
          </div>

          {/* Contact / Copyright */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact</h4>
            <p className="text-sm text-blue-100">support@smarttax.lk</p>
            <p className="text-sm text-blue-100 mt-2">© {new Date().getFullYear()} SmartTax. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </Dashboard>
  );
};

export default Home;