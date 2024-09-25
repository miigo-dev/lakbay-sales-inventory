import React from 'react'
import '../css/login.css';


const login = () => {

    return (
        <div className='login_container'>
            <div className='login_box'>
                <div className='logo_container'>
                    <img src='lakbaylogo.png' alt='Lakbay Logo' className='logo'/>
                </div>

            <h2>Lakbay Kape and Kain</h2>
            <p>Login to your account</p>

                <form>
                    <div className='form_input'>
                        <label htmlFor='username' className='username'>
                        <img src="envelope_icon.png" alt="email icon" className="input_icon"/>
                        </label>  
                        <input type='username' id='username' placeholder='Username' required />
                    </div>

                    <div className='form_input'>
                        <label htmlFor='password' className='password_icon'>
                        <img src="password_icon.png" alt="password icon" className="input_icon"/>
                        </label>  
                        <input type='password' id='password' placeholder='Password' required />
                    </div>

                    <div className='forgot_pass'>
                        <a href='/forgot_password'>Forgot Password</a>
                    </div>
                    <button type="submit" className="login_button">Login</button>
                </form>
            </div>
        </div>
    )
}

export default login;