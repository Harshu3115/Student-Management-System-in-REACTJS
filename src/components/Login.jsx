import React, { useState } from "react";
import { api } from "../service";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../assets/css/login.css'

const Login = ({ setLoggedInUser, goToRegister }) => {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = () => {
        setIsLoading(true);

        api.get("/users").then((res) => {
            const user = res.data.find(
                (u) =>
                    u.email === form.email &&
                    u.password === form.password
            );

            if (user) {
                setLoggedInUser(user);
                toast.success(`Welcome back, ${user.name || 'User'}!`);
            } else {
                toast.error("Invalid Email or Password");
            }
        }).catch(() => {
            toast.error("Something went wrong. Please try again.");
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-icon">
                        <FaSignInAlt />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue to your account</p>
                </div>

                <div className="login-form">
                    <div className="input-group">
                        <div className="input-icon">
                            <FaEnvelope />
                        </div>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Email Address"
                            value={form.email}
                            className="login-input"
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-icon">
                            <FaLock />
                        </div>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Password"
                            value={form.password}
                            className="login-input"
                        />
                    </div>

                    <div className="login-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot Password?</a>
                    </div>

                    <button
                        className={`login-btn ${isLoading ? 'loading' : ''}`}
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                <FaSignInAlt /> Login
                            </>
                        )}
                    </button>

                    <div className="register-section">
                        <p className="register-text">
                            Don't have an account?{" "}
                            <span
                                className="register-link"
                                onClick={goToRegister}
                            >
                                <FaUserPlus /> Create Account
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;