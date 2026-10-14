import {createContext,useContext,useState} from 'react';



const ThemeContext = createContext(null);



export function ThemeProvider({children})
{
    const [theme,setTheme]=useState(localStorage.getItem('theme')||'light');

    const toggleTheme =  () => 
    {
        if (theme=='light')
        {
            localStorage.setItem('theme','dark');
            setTheme('dark');

        }
        else
        {
            localStorage.setItem('theme','light');
            setTheme('light');
        }
        
    }

    return (
        <ThemeContext.Provider value = {{theme,toggleTheme}} >{children}</ThemeContext.Provider>
    )

};

export const useTheme = () => useContext(ThemeContext);
