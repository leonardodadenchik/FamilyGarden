import React, { createContext, useState, useContext } from 'react';
import {ThemeName} from 'tamagui'
interface ThemeContextProps {
	theme: string,
	toggleTheme: () => void,
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const useThemeContext = () => {
	const themeContext = useContext(ThemeContext);
	if (!themeContext) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return themeContext;
}

const ThemeProvider = ({children}: any) => {
	const [theme, setTheme] = useState('light_pink');

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light_pink' ? 'dark_pink' : 'light_pink'));
	};

	const value = {
		theme,
		toggleTheme
	}

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
};

export {
	useThemeContext,
	ThemeProvider
}