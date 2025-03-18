import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Dashboard from "../../components/Dashboard";
import TermsCondition from "./TermsCondition.jsx";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    role: "taxpayer",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // On form submission, validate and show the Terms modal
  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setShowTermsModal(true);
  };

  // When user accepts the terms, complete the registration
  const handleAcceptTerms = async () => {
    setShowTermsModal(false);
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5559/users/register",
        formData
      );
      if (response.data.success) {
        // Log the user in with the returned token and user data
        login(response.data.token, response.data.user, true);
        navigate("/profile");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "Registration failed");
      } else if (err.request) {
        setError("No response from the server. Check your connection.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Cancel modal and go back to registration form
  const handleCancelTerms = () => {
    setShowTermsModal(false);
  };

  return (
    <Dashboard>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-white/90 p-10 rounded-lg shadow-xl w-[28rem] backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Register
          </h2>
          {error && <p className="text-red-500 text-center mb-3">{error}</p>}

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3 mb-5">
            <button className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-100 transition-all">
              <FcGoogle className="w-6 h-6 mr-2" />
              Continue with Google
            </button>
            <button className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all">
              <FaFacebook className="w-6 h-6 mr-2" />
              Continue with Facebook
            </button>
          </div>

          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 font-medium">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none pr-12"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Render the imported TermsCondition as a modal overlay */}
      {showTermsModal && (
        <TermsCondition
          onAccept={handleAcceptTerms}
          onCancel={handleCancelTerms}
          loading={loading}
        />
      )}
    </Dashboard>
  );
};

export default Register;
