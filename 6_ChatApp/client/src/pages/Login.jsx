// import React, { useRef } from 'react'
// import { useNavigate } from 'react-router';
// import useAuth from '../context/authProvider';
// import auth from '../lib/auth'

// const Login = () => {
//     const navigate= useNavigate();
//     const emailRef= useRef();
//     const passwordRef= useRef();
//     const {login}= useAuth();

//     async function helper(e){
//         e.preventDefault();
//         const email= emailRef.current.value;
//         const password= passwordRef.current.value
//         const data= await login({email, password});
//         auth.token= data.token;
//         auth.user= data.user;
//         // console.log(isLoggedin)
//         navigate('/dashboard')
//     }
//   return (
//     <>
//     <form onSubmit={helper}>
//         <input ref={emailRef} type="text" placeholder='enter email' />
//         <input ref={passwordRef} type="text" placeholder='enter password' />
//         <button>login</button>
//     </form>
//     not a user- <button onClick={()=>navigate('/signup')}>signup</button>
//     </>
//   )
// }

// export default Login
import React, { useRef } from 'react'
import { useNavigate } from 'react-router';
import useAuth from '../context/authProvider';
import auth from '../lib/auth';
import './Login.css'

const Login = () => {
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();

    async function helper(e) {
        try {
            e.preventDefault();
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const data = await login({ email, password });
            console.log(data);
            auth.token = data.token;
            auth.user = data.user;

            navigate('/dashboard')
        } catch (error) {
            alert(error.response.data.message)
            console.log(error);
        }
    }

    return (
        <div className="login-container">
            <div className='chatname' >
                    <img src='/speech-bubble.png' alt="chat" className='chat-icon'/>
                    ChatOn
                    </div>
            <div className="login-card">
                <h1 >Welcome Back</h1>
                <form onSubmit={helper} className="login-form">
                        <input 
                            ref={emailRef} 
                            // type="email" 
                            placeholder="Enter your email" 
                            required 
                        />
                        <input 
                            ref={passwordRef} 
                            type="password" 
                            placeholder="Enter your password" 
                            required 
                        />
                    <button type="submit" >Log In</button>
                </form>
                <div className="signuplink">
                    Don't have an account? 
                    <button className="linkbtn" onClick={() => navigate('/signup')}>Sign up</button>
                </div>
            </div>
        </div>
    )
}

export default Login
