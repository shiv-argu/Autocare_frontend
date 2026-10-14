import {useTheme} from '../context/ThemeContext';

export default function ThemeButton()
{

    const {theme,toggleTheme}=useTheme();
    

    return (
        <button onClick={toggleTheme}>
            Current Theme: {theme=== 'light'?'Ligth':'Dark'} (Click to switch)
        </button>
    );

}

