import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Login()
{
    const {login} = useAuth();
    const navigate= useNavigate();
    const[email,setEmail]=useState('');
    const[password,setPassword]=useState('');
    const[error,setError]=useState('');


    const handleSubmit = async(e)=>
    {
        e.preventDefault();
        setError('');
        try{
            await login(email,password);
            navigate('/');
        }
        catch{
            setError('Incorrect email or password');
        }

        };

    return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">AutoCare Login</h2>
        <input className="input w-full" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn w-full">Login</button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}