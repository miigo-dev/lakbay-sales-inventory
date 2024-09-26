import React from 'react'
import '../css/register.css';
import logo from '../assets/lakbaylogo50px.png';
import user_icon from '../assets/profile_icon25px.png';
import email_icon from '../assets/email_icon25px.png';
import password_icon from '../assets/pass_icon25px.png';


const register = () => {
    return (
    <div className = 'register_container'>
    <div className = 'register_box'>
        <div>
            <img src={logo} alt='Lakbay Logo' className='logo'/>
        </div>

    <h2>Lakbay Kape and Kain</h2>
    <p>Create your account</p>

        <form>
            <div className = 'form_input'>
                <label htmlFor='first name' className='first name'>
                <img src={user_icon} alt="human icon" className="input_icon"/>
                </label>  
                <input type='firstName' id='firstName' placeholder='First Name' required />
            </div>

            <div className = 'form_input'>
                <label htmlFor='last name' className='last name'>
                <img src={user_icon} alt="human icon" className="input_icon"/>
                </label>  
                <input type='lastName' id='lastName' placeholder='Last Name' required />
            </div>

        <div className = 'form_input'>
            <label htmlFor='emailAddress' className='emailAddress'>
            <img src={email_icon} alt="human icon" className="input_icon"/>
            </label>  
            <input type='emailAddress' id='emailAddress' placeholder='Your Email Address' required />
        </div>

        <div className='form_input'>
            <label htmlFor='password' className='password_icon'>
            <img src={password_icon} alt="password icon" className="input_icon"/>
            </label>  
            <input type='password' id='password' placeholder='Create Password' required  />
        </div>

        <div className='form_input'>
            <label htmlFor='confirmPassword' className='password_icon'>
            <img src={password_icon} alt="password icon" className="input_icon"/>
            </label>  
            <input type='confirmPassword' id='confirmPassword' placeholder='Confirm Password' required />
        </div>
            <button type="submit" className="register_button">Register</button>
        </form>
    </div>
</div>

    )
}

export default register