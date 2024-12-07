import React from "react";
import { Link } from "react-router-dom";
import "../styles/forgotpassword.css";

const ForgotPassword = () => {
        return (
            <div className="forgot-password-container">
            <div className="forgot-password-card">
                <div className="forgot-password-logo">
                <img
                    src="path-to-your-logo.png"
                    alt="Logo"
                    className="forgot-password-logo-img"
                />
                </div>
                <h2 className="forgot-password-title">Forgot Password</h2>
                <p className="forgot-password-subtitle">
                    Enter your email address or username
                </p>
                <input
                type="text"
                placeholder="Email or Username"
                className="forgot-password-input"
                />
                <button className="forgot-password-button">Send Reset Link</button>
                <Link to="/" className="forgot-password-link">
                Back to Login
                </Link>
            </div>
            </div>
        );
        };

export default ForgotPassword;