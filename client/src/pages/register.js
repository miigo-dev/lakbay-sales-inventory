import React from 'react'
import '../css/register.css';


const register = () => {


    return (

    <div className = 'register_container'>
    <div className = 'register_box'>
        
        <div>
            <img src='lakbaylogo.png' alt='Lakbay Logo' className='logo'/>
        </div>

    <h2>Lakbay Kape and Kain</h2>
    <p>Create your account</p>

        <form>
                <div className = 'form_input'>

                        <label htmlFor='fullname' className='fullname'>
                        <img src="" alt="human icon" className="input_icon"/>
                        </label>  
                        <input type='fullname' id='fullname' placeholder='Your Full Name' required />

                </div>

                <div className = 'form_input'>

                    <label htmlFor='emailAddress' className='emailAddress'>
                    <img src="" alt="human icon" className="input_icon"/>
                    </label>  
                    <input type='emailAddress' id='emailAddress' placeholder='Your Email Address' required />

                </div>

                <div className='form_input'>

                    <label htmlFor='password' className='password_icon'>
                    <img src="password_icon.png" alt="password icon" className="input_icon"/>
                    </label>  
                    <input type='password' id='password' placeholder='Create Password' required  />

                </div>

                <div className='form_input'>

                    <label htmlFor='confirmPassword' className='password_icon'>
                    <img src="password_icon.png" alt="password icon" className="input_icon"/>
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