import {createContext, useContext, useEffect, useState} from 'react';
import{API_URL, useAuthContext} from "@/app/context/auth";


interface UserProps {
	getUser: () => Promise<any>;
}

const UserContext = createContext<UserProps | undefined>(undefined)

const useUserContext = () => {
	const userContext = useContext(UserContext);
	if (!userContext){
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return userContext;
}

const UserProvider = ({children}: any) => {
	const {authState} = useAuthContext();
	useEffect(() => {
		console.log("tipitopbombom207");
		console.log(authState);
	}, [authState]);

	const value = {
		someValue: "value"
	}
	return <UserContext.Provider value={{value}}>{children}</UserContext.Provider>;
}

export {
	useUserContext,
	UserProvider
}