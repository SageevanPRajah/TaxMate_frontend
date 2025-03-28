import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setShowTermsModal(true);
  };

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

  const handleCancelTerms = () => {
    setShowTermsModal(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5559/auth/google";
  };

  const handlefaceBookLogin = () => {
    window.location.href = "http://localhost:5559/auth/facebook";
  };

  return (
    <div
      className="w-screen h-screen flex flex-col"
      style={{
        backgroundImage: "url('/backrd4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white/90 p-10 rounded-lg shadow-xl w-[28rem] backdrop-blur-md">
          {error && <p className="text-red-600 text-center mb-3">{error}</p>}

          <div className="flex justify-between mb-4 gap-2">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm hover:bg-gray-50"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Google
            </button>
            <button
              onClick={handlefaceBookLogin}
              className="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg bg-white text-black shadow-sm hover:bg-gray-50"
            >
              <FaFacebook className="w-5 h-5 mr-2 text-blue-600" />
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span
                className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
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

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
          <TermsCondition
            onAccept={handleAcceptTerms}
            onCancel={handleCancelTerms}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default Register;
