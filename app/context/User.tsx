import {createContext, useContext, useEffect, useState} from 'react';
import {useAuthContext} from "@/app/context/Auth";
import axios from "axios";
import {API_URL} from "@/constants/constants";
import {Animated} from "react-native";
import add = Animated.add;

interface UserData {
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

interface GetCurrentUserResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UpdateUserProps {
	userRoleId: number,
	userGenderId: number,
	userStatusId: number,
	userName: string,
	firstName: string,
	lastName: string,
	email: string,
	hexColor: string
}

interface UpdateUserResponse {
	data: any | undefined,
	error: any | undefined,
}

interface CreateFamilyProps {
	newFamilyName: string,
	newFamilyDescription: string
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

interface AddToFamilyProps {
	userId: number,
}

interface AddToFamilyResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UserContextProps {
	appData: UserData | undefined;
	getCurrentUser: () => Promise<GetCurrentUserResponse>;
	updateUser: (updateUserProps: UpdateUserProps) => Promise<UpdateUserResponse>;
	createFamily: (createFamilyProps: CreateFamilyProps) => Promise<CreateFamilyResponse>,
	getFamily: () => Promise<GetFamilyResponse>,
	addToFamily: (addToFamilyProps: AddToFamilyProps) => Promise<AddToFamilyResponse>,
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

	const [appData, setAppData] = useState<UserData>({
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
	});

	//Load and add Token to header
	const {authState} = useAuthContext();
	useEffect(() => {
		if (authState.authenticated == true) {
			axios.defaults.headers.common['authorization'] = `Bearer ${authState.token}`
		}
	}, [authState]);


	//Automatically load user data
	useEffect(() => {
		if (authState.authenticated == true) {
			const updateUserData = async () => {
				const {data, error} = await getCurrentUser()
				if (data) {
					setAppData({
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
					})
				} else {
					console.log("Error while getting User Data")
					console.log(error);
				}
			}

			if (!appData.isReceived) {
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

	const updateUser = async (updateUserProps: UpdateUserProps) => {
		try {
			const result = await axios.put(`${API_URL}/user/update`, updateUserProps)
			return {data: result, error: undefined}
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	//Family Management
	const createFamily = async (createFamilyProps: CreateFamilyProps) => {
		try {
			const result = await axios.post(`${API_URL}/user/create-family`, createFamilyProps)

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

	const addToFamily = async (addToFamilyProps: AddToFamilyProps) => {
		try {
			const result = await axios.patch(`${API_URL}/user/add-to-family?userToAdd=${addToFamilyProps.userId}`)
			return {data: result, error: undefined}
		} catch (error) {
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