import React from 'react'
import { useState } from 'react';
import { onLogin } from '../api/auth';
import '../css/login.css';
import { useDispatch } from 'react-redux';
import { authenticateUser } from '../redux/slices/authSlice';


const Login = () => {
    const [values, setValues] = useState({
      email: '',
      password: '',
    })
    const [error, setError] = useState(false)
  
    const onChange = (e) => {
      setValues({ ...values, [e.target.name]: e.target.value })
    }
  
    const dispatch = useDispatch()
    const onSubmit = async (e) => {
      e.preventDefault()
  
      try {
        await onLogin(values)
        dispatch(authenticateUser())
  
        localStorage.setItem('isAuth', 'true')
      } catch (error) {
        console.log(error.response.data.errors[0].msg)
        setError(error.response.data.errors[0].msg)
      }
    }

    return (
        <div className='login_container'>
            <div className='login_box'>
                <div className='logo_container'>
                    <img src='lakbaylogo.png' alt='Lakbay Logo' className='logo'/>
                </div>

            <h2>Lakbay Kape and Kain</h2>
            <p>Login to your account</p>

                <form onSubmit={(e) => onSubmit(e)}>
                    <div className='form_input'>
                        <label htmlFor='username' className='username'>
                        <img src="envelope_icon.png" alt="email icon" className="input_icon"/>
                        </label>  
                        <input
                        onChange={(e) => onChange(e)}
                        type='username' 
                        value={values.username}
                        id='username'
                        name='username'
                        placeholder='Username' 
                        required
                        />
                    </div>

                    <div className='form_input'>
                        <label htmlFor='password' className='password'>
                        <img src="password_icon.png" alt="password icon" className="input_icon"/>
                        </label>  
                        <input
                        onChange={(e) => onChange(e)}
                        type='password' 
                        value={values.password}
                        id='password'
                        name='password'
                        placeholder='Password' 
                        required
                        />
                    </div>

                    <div className='forgot_pass'>
                        <a href='/forgot_password'>Forgot Password</a>
                    </div>

                    <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>

                    <button type="submit" className="login_button">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;