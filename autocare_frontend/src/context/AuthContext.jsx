import {createContext, useContext,useState} from 'react';
import {login as loginApi} from '../api/auth';

const AuthContext= createContext(null);

export function AuthProvider({children})
{
    const [token,setToken]=useState(localStorage.getItem('token'));


    const login = async (email,password)=>{
        const t = await loginApi(email,password);
        localStorage.setItem('token',t);
        setToken(t);
    }
    const logout=()=>{
        localStorage.removeItem('token');
        setToken(null);

    };

    return (
        <AuthContext.Provider value= {{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth =()=>useContext(AuthContext);


