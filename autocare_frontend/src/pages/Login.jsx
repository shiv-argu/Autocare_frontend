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
        <form onSubmit={handleSubmit} >

            <h2>Autocare Login</h2>
            <input placeholder ="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input placeholder= "Password" type ="password" value = {password} onChange={(e)=>setPassword(e.target.value)}/>
            <button type= 'submit'> Login </button>
            {error && <p style={{color:'red'}}>{error}</p>}
        </form>
    )

}