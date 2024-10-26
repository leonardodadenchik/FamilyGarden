import {createContext, useContext, useEffect, useState} from 'react';
import {useAuthContext} from "@/app/context/auth";
import axios from "axios";
import {API_URL} from "@/constants/constants";

interface GetUserResponse {
	data: any | undefined;
	error: any | undefined;
}

interface UserContextProps {
	someValue: any | undefined;
}

interface UserDataProps {
	profileData: {
		isReceived: boolean | undefined,
		userId: Number | null | undefined,
		familyId: Number | null | undefined,
		birthDate: Date | undefined,
		userName: string | undefined,
		firstName: string | undefined,
		lastName: string | undefined,
		email: string | undefined,
		registrationDate: string | undefined,
		credits: Number | null | undefined,
		hexColor: string | undefined,
		userRole: string | undefined,
		userGender: string | undefined,
		userStatus: string | undefined

	}
}


const UserContext = createContext<UserContextProps | undefined>(undefined)

const useUserContext = () => {
	const userContext = useContext(UserContext);
	if (!userContext) {
		throw new Error('useUserContext must be used within a UserProvider');
	}
	return userContext;
}


const UserProvider = ({children}: any) => {

	const [appData, setAppData] = useState<UserDataProps>({
		profileData: {
			isReceived: undefined,
			userId: undefined,
			familyId: undefined,
			birthDate: undefined,
			userName: undefined,
			firstName: undefined,
			lastName: undefined,
			email: undefined,
			registrationDate: undefined,
			credits: undefined,
			hexColor: undefined,
			userRole: undefined,
			userGender: undefined,
			userStatus: undefined
		}
	});

	const {authState} = useAuthContext();
	useEffect(() => {
		if (authState.authenticated == true) {
			axios.defaults.headers.common['authorization'] = `Bearer ${authState.token}`

			const updateUserData = async () => {
				const {data, error} = await getCurrentUser()
				if (data) {
					 setAppData({
						profileData: {
							isReceived: true,
							userId: data.data.value.userId,
							familyId: data.data.value.familyId,
							birthDate: data.data.value.birthDate,
							userName: data.data.value.userName,
							firstName: data.data.value.firstName,
							lastName: data.data.value.lastName,
							email: data.data.value.email,
							registrationDate: data.data.value.registrationDate,
							credits: data.data.value.credits,
							hexColor: data.data.value.hexColor.trim(),  //Trimming hexColor as DB adds some spaces
							userRole: data.data.value.userRole,
							userGender: data.data.value.userGender,
							userStatus: data.data.value.userStatus
						}
					})
				} else {
					console.log("Error while getting User Data")
					console.log(error);
				}
			}
			if (!appData.profileData.isReceived) {
				updateUserData()
			}

		}
	}, [authState]);

	const getCurrentUser = async () => {
		try {
			const result = await axios.get(`${API_URL}/user/get-current-user`)
			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	const value = {
		someValue: "value"
	}
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export {
	useUserContext,
	UserProvider
}