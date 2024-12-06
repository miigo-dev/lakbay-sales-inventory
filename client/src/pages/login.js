import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { onLogin } from '../api/auth';
import { authenticateUser } from '../redux/slices/authSlice';
import '../css/login.css';
import logo from '../assets/icons/LKK.svg';
import profile_icon from '../assets/icons/users_inactive.png';
import password_icon from '../assets/icons/pass_icon25px.png';
import background from '../assets/icons/Coffeebackground2.svg';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
        await onLogin(values);
        dispatch(authenticateUser());
        localStorage.setItem('isAuth', 'true');
        } catch (error) {
        const errorMsg = error.response?.data?.errors?.[0]?.msg || 'Login failed. Please try again.';
        console.error(errorMsg);
        setError(errorMsg);
        }
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
            <h2>Lakbay Kape and Kain</h2>
            <p>Login to your account</p>

            <form onSubmit={onSubmit}>
            <div className="form_input">
                <label htmlFor="username" className="username">
                <img src={profile_icon} alt="email icon" className="input_icon" />
                </label>
                <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                value={values.username}
                onChange={onChange}
                required
                />
            </div>

            <div className="form_input">
                <label htmlFor="password" className="password">
                <img src={password_icon} alt="password icon" className="input_icon" />
                </label>
                <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                value={values.password}
                onChange={onChange}
                required
                />
            </div>

            <div className="forgot_pass">
                <a href="/forgot_password">Forgot Password</a>
            </div>

            {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

            <button type="submit" className="login_button">
                Login
            </button>
            </form>
        </div>
        </div>
    );
};

export default Login;
