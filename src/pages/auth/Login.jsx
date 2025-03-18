import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth.js';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Dashboard from '../../components/Dashboard.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5559/users/login', { email, password });
      const { token, user } = response.data;

      // Call the login function from your auth hook with the token, user data, and rememberMe flag
      login(token, user, rememberMe);

      // Redirect to the profile page after a successful login
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5559/auth/google";
  };

  const handlefaceBookLogin = () => {
    window.location.href = "http://localhost:5559/auth/facebook";
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] ">
        <div className="bg-white p-10 rounded-lg shadow-xl w-[28rem] backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3 mb-5">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-all"
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Continue with Google
          </button>
            <button 
              onClick={handlefaceBookLogin}
              className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all">
              <FaFacebook className="w-6 h-6 mr-2" />
              Continue with Facebook
            </button>
          </div>

          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4"
                />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Dashboard>
  );
};

export default Login;
