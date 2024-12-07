import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/forgotpassword.css';
import logo from '../assets/icons/LKK.svg';
import email_icon from '../assets/icons/users_inactive.png';
import background from '../assets/icons/Coffeebackground2.svg';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // Mock API call for validating email/username
            // Replace this with an actual API call
            const isValid = await mockValidateEmail(email);

            if (isValid) {
                setMessage('If an account with this email exists, a reset link will be sent.');
                setError(false);

                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                throw new Error('Invalid email or username');
            }
        } catch (err) {
            console.error(err);
            setMessage(err.message || 'An error occurred. Please try again later.');
            setError(true);
        }
    };

    // Mock API validation function
    const mockValidateEmail = async (email) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate validation logic
                const validEmails = ['user@example.com', 'test@domain.com']; // Example valid emails
                resolve(validEmails.includes(email));
            }, 1000); // Simulate network delay
        });
    };

    return (
        <div
            className="login_container"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
            }}
        >
            <div className="login_box">
                <div className="logo_container">
                    <img src={logo} alt="Lakbay Logo" className="logo" />
                </div>
                <h2>Forgot Password</h2>
                <p>Enter your email or username</p>

                <form onSubmit={onSubmit}>
                    <div className="form_input">
                        <label htmlFor="email" className="username">
                            <img src={email_icon} alt="email icon" className="input_icon" />
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email or username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {message && (
                        <div
                            style={{
                                color: error ? 'red' : 'green',
                                margin: '10px 0',
                                fontSize: '0.85rem',
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <button type="submit" className="login_button">
                        Submit
                    </button>
                </form>

                <div className="forgot_pass">
                    <a href="/login">Back to Login</a>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
