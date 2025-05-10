import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AiOutlineBell } from 'react-icons/ai';
import {
  BsRobot,
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPersonCircle,
} from 'react-icons/bs';



const Dashboard = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [ 
    { to: '/profileIndex', icon: BsPersonCircle , label: 'User Access' },
  ];

  return (
    <div className="flex flex-col w-full h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 shadow-xl bg-gradient-to-r from-blue-900 to-blue-700">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">TaxMate</h1>
        <nav className="flex items-center gap-6">
          <Link to="/chat" className="p-2 transition-colors rounded-full hover:bg-white/20" title="Chat">
            <BsRobot className="w-6 h-6 text-white" />
          </Link>
          <Link to="/notification" className="p-2 transition-colors rounded-full hover:bg-white/20" title="Notifications">
            <AiOutlineBell className="w-6 h-6 text-white" />
          </Link>
          <Link to={isAuthenticated ? '/profile' : '/login'} title={isAuthenticated ? 'Profile' : 'Login'}>
            <img
              src={user?.profilePicture || '/public/default-profile.png'}
              alt="Profile"
              className="w-10 h-10 transition-transform border-2 border-white rounded-full shadow-md hover:scale-110"
            />
          </Link>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`relative flex flex-col items-center gap-8 bg-gradient-to-br from-blue-800 to-blue-900 backdrop-blur-lg transition-all duration-300 shadow-2xl ${
            isCollapsed ? 'w-20 py-6' : 'w-64 py-10'
          }`}
        >
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute p-1 text-blue-800 transition-colors transform -translate-x-1/2 bg-white rounded-full shadow-lg top-2 left-1/2 hover:bg-orange-500 hover:text-white"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <BsArrowRightCircle className="w-5 h-5" />
            ) : (
              <BsArrowLeftCircle className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link to="/">
            <div
              className={`flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 shadow-md transition-all duration-300 ${
                isCollapsed ? 'w-12 h-12 mt-6' : 'w-24 h-24 mt-0'
              }`}
            >
              <img
                src="/public/logo.png"
                alt="Logo"
                className={`rounded-full transition-transform duration-500 ease-out ${
                  isCollapsed ? '' : 'hover:scale-110'
                }`}
              />
            </div>
          </Link>

          {/* Menu Items */}
          <nav className="flex flex-col items-center w-full px-2">
            {menuItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`group flex items-center w-full p-3 my-1 transition-colors duration-300 rounded-xl border ${
                  isCollapsed
                    ? 'border-transparent hover:border-white/30 hover:bg-white/10'
                    : 'bg-blue-700 border-blue-700 hover:bg-white'
                }`}
                title={label}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isCollapsed
                      ? 'text-white hover:text-blue-700'
                      : 'text-white group-hover:text-blue-700'
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`ml-4 text-lg font-medium transition-colors ${
                      isCollapsed
                        ? 'text-white hover:text-blue-700'
                        : 'text-white group-hover:text-blue-700'
                    }`}
                  >
                    {label}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className="flex-1 p-6 overflow-y-auto bg-center bg-cover"
          style={{ backgroundImage: "url('/backrd4.png')" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;