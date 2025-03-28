import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AiOutlineBell } from 'react-icons/ai';
import { BsRobot, BsBox, BsGraphUpArrow, BsGraphDownArrow, BsBank2, BsCreditCard2BackFill, BsCashCoin, BsPercent, BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';

const Dashboard = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className='flex flex-col w-full h-screen'>
      {/* Header */}
      <header className='flex items-center justify-between w-full px-8 py-4 text-2xl font-bold text-white bg-blue-900 shadow-md'>
        <div className='flex items-center gap-6'>
          <span className='text-3xl font-extrabold tracking-wide'>TaxMate</span>
        </div>
        <nav className='flex items-center gap-6'>
          <Link to='/chat' className='hover:underline'>
            <BsRobot className='w-8 h-8' />
          </Link>
          <Link to='/income' className='hover:underline'>
            <AiOutlineBell className='w-8 h-8' />
          </Link>
          {isAuthenticated ? (
            <Link to='/profile'>
              <img
                src={user?.profilePicture || '/public/default-profile.png'}
                alt='Profile'
                className='w-10 h-10 rounded-full cursor-pointer'
              />
            </Link>
          ) : (
            <Link to='/login'>
              <img
                src='/public/default-profile.png'
                alt='Login'
                className='w-10 h-10 rounded-full cursor-pointer'
              />
            </Link>
          )}
        </nav>
      </header>
      
      <div className='flex flex-1 w-full'>
        {/* Sidebar (Collapsible) */}
        <aside className={`bg-blue-800 text-white p-5 flex flex-col gap-4 shadow-lg items-center transition-all ${isCollapsed ? 'w-20' : 'w-[16%]'}`}>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className='mb-4 text-white'>
            {isCollapsed ? <BsArrowRightCircle className='w-6 h-6' /> : <BsArrowLeftCircle className='w-6 h-6' />}
          </button>
          <Link to='/'>
            <img src='/public/logo.png' alt='Logo' className={`${isCollapsed ? 'w-[70%]' : 'w-[50%]'} h-auto mx-auto rounded-full transition-all duration-300`} />
          </Link>
          <nav className='flex flex-col w-full gap-3'>
            <Link to='/product' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsBox className="w-6 h-6" /> {!isCollapsed && 'Product'}
            </Link>
            <Link to='/income' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsGraphUpArrow className="w-6 h-6" /> {!isCollapsed && 'Income'}
            </Link>
            <Link to='/expenses' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsGraphDownArrow className="w-6 h-6" /> {!isCollapsed && 'Expenses'}
            </Link>
            <Link to='/' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsBank2 className="w-6 h-6" /> {!isCollapsed && 'Assets'}
            </Link>
            <Link to='/' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsCreditCard2BackFill className="w-6 h-6" /> {!isCollapsed && 'Liabilities'}
            </Link>
            <Link to='/taxRelief' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsCashCoin className="w-6 h-6" /> {!isCollapsed && 'Tax Payment'}
            </Link>
            <Link to='/taxRelief' className='flex items-center justify-center gap-4 p-3 text-center transition-all duration-300 border-2 border-orange-600 rounded-full shadow-md backdrop-blur-md bg-white/10 hover:bg-white/20 shadow-orange-700/30 hover:shadow-orange-700/70 hover:scale-105'>
              <BsPercent className="w-6 h-6" /> {!isCollapsed && 'Tax Rate'}
            </Link>
          </nav>
        </aside>


        {/* Content */}
        <main className='w-[84%] p-6 bg-gray-100 flex-1 overflow-y-auto bg-cover bg-center' style={{ backgroundImage: "url('/backrd4.png')" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
