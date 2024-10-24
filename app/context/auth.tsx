import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter, useSegments} from 'expo-router'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
// @ts-ignore
import {decode} from 'base-64';

global.atob = decode;

interface SignInResponse {
	data: any | undefined,
	error: any | undefined,
}

interface SignOutResponse {
	data: any | undefined,
	error: any | undefined,
}

interface AuthProps {
	authState: { token: string | null, refreshToken: string | null, authenticated: boolean | null },
	onRegister: (email: string,
				 password: string,
				 firstName: string,
				 lastName: string,
				 userGenderId: number,
				 userRoleId: number,
				 deviceInformation: string,
				 birthDate: string) => Promise<SignInResponse>,
	onLogin: (email: string, password: string, deviceInformation: string) => Promise<SignInResponse>,
	onLogout: () => Promise<SignOutResponse>
}

const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token'
const API_URL = 'http://fgarden.somee.com/api/v1';

const AuthContext = createContext<AuthProps | undefined>(undefined);

const useAuthContext = () => {
	const authContext = useContext(AuthContext);

	if (!authContext){
		throw new Error('useAuthContext must be used within a AuthProvider');
	}
	return authContext;
}

const AuthProvider = ({children}: any) => {
	//declaring authState
	const [authState, setAuthState] = useState<{
		token: string | null,
		refreshToken: string | null,
		authenticated: boolean | null
	}>({
		token: null,
		refreshToken: null,
		authenticated: null
	});

	// Check if there is any tokens stored
	useEffect(() => {
		const loadToken = async () => {
			const token = await SecureStore.getItemAsync(TOKEN_KEY);
			const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
			console.log("stored: token-", token, " refreshToken-", refreshToken);

			if (token) {
				axios.defaults.headers.common['authorization'] = `Bearer ${token}`

				setAuthState({
					token: token,
					refreshToken: refreshToken,
					authenticated: true
				})
			}
		}
		loadToken();
	}, [])

	// Set refresh time for the token if not expired, or refresh immediately
	useEffect(() => {
		const tokenCheck = async () => {
			if (authState.token) {
				let decodedToken = jwtDecode(authState.token);
				// @ts-ignore
				let daysSinceCreation = (Date.now() / 1000 - decodedToken.iat) / (60 * 60 * 24);
				if (daysSinceCreation >= 1) {    //if token older than day then refresh it
					const {data, error} = await refreshToken()
					if (data) {
						console.log("Token Refreshed!");
						console.log(data.data.value);
					} else {
						console.log("Error while Refreshing Token");
						console.log(error);
					}
				} else {
					const renewToken = setTimeout(async () => {
						const {data, error} = await refreshToken()
						if (data) {
							console.log("Token Refreshed!");
							console.log(data.data.value);
						} else {
							console.log("Error while Refreshing Token");
							console.log(error);
						}
					}, (1 - daysSinceCreation) * 24 * 60 * 60 * 1000)
					return () => {
						clearTimeout(renewToken)
					}
				}
			}
		}
		tokenCheck()
	}, [authState])

	const router = useRouter()
	const routeSegments = useSegments()
	// display the tabs screen if the user is authenticated
	useEffect(() => {
		const useProtectedRoute = () => {
			if (authState.authenticated) {
				if (routeSegments[0] == "(auth)") {
					router.replace('/Home/HomeScreen');
				}
			} else {
				router.replace('/');
			}
		}
		useProtectedRoute()
	}, [authState])


	const register = async (email: string,
							password: string,
							firstName: string,
							lastName: string,
							userGenderId: number,
							userRoleId: number,
							deviceInformation: string,
							birthDate: string) => {
		try {
			const result = await axios.post(`${API_URL}/auth/register`, {
				email,
				password,
				firstName,
				lastName,
				userGenderId,
				userRoleId,
				deviceInformation,
				birthDate
			});

			axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

			await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.response.token);
			await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.response.refreshToken);

			setAuthState({
				token: result.data.value.response.token,
				refreshToken: result.data.value.response.refreshToken,
				authenticated: true
			})

			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	const login = async (email: string, password: string, deviceInformation: string) => {
		try {
			const result = await axios.post(`${API_URL}/auth/login`, {email, password, deviceInformation});

			axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

			await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.token);
			await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.refreshToken);

			setAuthState({
				token: result.data.value.token,
				refreshToken: result.data.value.refreshToken,
				authenticated: true
			})

			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	};

	const logout = async () => {
		try {
			setAuthState({
				token: null,
				refreshToken: null,
				authenticated: false
			})

			const result = await axios.post(`${API_URL}/auth/logout`, {refreshToken: authState.refreshToken})

			axios.defaults.headers.common['Authorization'] = '';

			await SecureStore.deleteItemAsync(TOKEN_KEY);
			await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);


			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}


	}

	const refreshToken = async () => {
		try {
			const result = await axios.post(`${API_URL}/auth/refresh-token`, {
				token: authState.token,
				refreshToken: authState.refreshToken
			})

			axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

			await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.token);
			await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.refreshToken);

			setAuthState({
				token: result.data.value.token,
				refreshToken: result.data.value.refreshToken,
				authenticated: true
			})

			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}


	const value = {
		onRegister: register,
		onLogin: login,
		onLogout: logout,
		authState
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {
	API_URL,
	useAuthContext,
	AuthProvider
}
