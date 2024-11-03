import {createContext, useContext, useEffect, useState} from 'react';
import {useAuthContext} from "@/app/context/auth";
import axios from "axios";
import {API_URL} from "@/constants/constants";

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

interface CreateFamilyResponse {
	data: any | undefined,
	error: any | undefined,
}

interface GetFamilyResponse {
	data: any | undefined,
	error: any | undefined,
}

interface LeaveFamilyResponse {
	data: any | undefined,
	error: any | undefined,
}

interface GetCurrentUserResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UpdateUserResponse {
	data: any | undefined,
	error: any | undefined,
}

interface AddToFamilyResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UserContextProps {
	appData: UserDataProps | undefined;
	getCurrentUser: () => Promise<GetCurrentUserResponse>;
	updateUser: (userRoleId: number,
				 userGenderId: number,
				 userStatusId: number,
				 userName: string,
				 firstName: string,
				 lastName: string,
				 email: string,
				 hexColor: string) => Promise<UpdateUserResponse>;
	createFamily: (newFamilyName: string, newFamilyDescription: string) => Promise<CreateFamilyResponse>,
	getFamily: () => Promise<GetFamilyResponse>,
	addToFamily: (userId: number) => Promise<AddToFamilyResponse>,
	leaveFamily: () => Promise<LeaveFamilyResponse>,
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

	//Automatically load user data
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

	//User Management

	const getCurrentUser = async () => {
		try {
			const result = await axios.get(`${API_URL}/user/get-current-user`)
			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	const updateUser = async (userRoleId: number,
							  userGenderId: number,
							  userStatusId: number,
							  userName: string,
							  firstName: string,
							  lastName: string,
							  email: string,
							  hexColor: string) => {
		try {
			const result = await axios.put(`${API_URL}/user/update`,
				{
					userRoleId: 1,
					userGenderId: 1,
					userStatusId: 1,
					userName: "MishaProkopenko",
					firstName: "Misha",
					lastName: "Prokopenko",
					email: "dima@user.user",
					hexColor: "#1CCA4B"
				})
			return {data: result, error: undefined}
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	//Family Management
	const createFamily = async (newFamilyName: string, newFamilyDescription: string) => {
		try {
			const result = await axios.post(`${API_URL}/user/create-family`, {
				familyName: newFamilyName,
				familyDescription: newFamilyDescription
			})

			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	const getFamily = async () => {
		try {
			const result = await axios.get(`${API_URL}/user/get-my-family`)
			return {data: result, error: undefined}
		} catch (error) {
			return {data: undefined, error: undefined}
		}
	}

	const addToFamily = async (userId: number) => {
		try {
			const result = await axios.patch(`${API_URL}/user/add-to-family?userToAdd=${userId}`)
			return {data: result, error: undefined}
		}catch (error) {
			return {data: undefined, error: error};
		}
	}

	const leaveFamily = async () => {
		try {
			const result = await axios.delete(`${API_URL}/user/leave-family`)
			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}


	const value = {
		getCurrentUser,
		updateUser,
		createFamily,
		getFamily,
		addToFamily,
		leaveFamily,
		appData,
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export {
	useUserContext,
	UserProvider
}