import React,{useState} from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { Form, Input, message } from "antd";
import '../styles/LayoutStyle.css'
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertslice';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const[user,setUser]=useState(null);

    const navigate=useNavigate();
    const dispath=useDispatch();
    const submitHandler =async (e) => {
        e.preventDefault();
        try {
            dispath(showLoading());
            const response=await axios.post('http://localhost:3000/users/login', { email, password });
            window.location.reload();
            dispath(hideLoading());
            setUser(response.data.user);
            if(response.data.success)
            {
                const token=response.data.token;
                localStorage.setItem('token',token);
                navigate('/');
            }
            else 
            {
                console.log(res.data.message);
                
                message.error(res.data.message);
            }
        } catch (error) {
            dispath(hideLoading());
            console.log(error);
            message.error("something went wrong");
        }
        console.log( email, password);
        setEmail('');
        setPassword('');
    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 transform transition-all hover:scale-101">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Login to your Account</h1>
                <form className="flex flex-col space-y-6" onSubmit={submitHandler}>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                        Login
                    </button>
                </form>

                {/* Additional Links */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:text-blue-400 transition-all">
                            register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
  )
}

export default Login
