import {createContext, useContext, useEffect, useState} from 'react';
import {useRouter} from 'expo-router'
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
import { decode } from "base-64";
global.atob = decode;

interface AuthProps {
    authState: { token: string | null, refreshToken: string | null, authenticated: boolean | null },
    onRegister: (email: string,
                 password: string,
                 firstName: string,
                 lastName: string,
                 userGenderId: number,
                 userRoleId: number,
                 deviceInformation: string,
                 birthDate: string) => Promise<any>,
    onLogin: (email: string, password: string, deviceInformation: string) => Promise<any>,
    onLogout: () => Promise<any>
}

const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token'
export const API_URL = 'http://fgarden.somee.com/api/v1';
const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
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

    //Set refresh time for the token if exists or refresh immediately
    // useEffect(() => {
    //     const tokenCheck = () => {
    //         if (authState.token) {
    //             let decodedToken = jwtDecode(authState.token);
    //             let daysSinceCreation = (Date.now()/1000 - decodedToken.iat)/(60*60*24);
    //             if (daysSinceCreation >= 1){    //if token older than day then refresh it
    //                 refreshToken().catch((err) => {console.log(err)})
    //             }else{
    //                 const renewToken = setTimeout(() => {refreshToken().catch((err) => {console.log(err)})}, (1 - daysSinceCreation)*24+60+60)
    //                 return () => {
    //                     clearTimeout(renewToken)
    //                 }
    //             }
    //         }
    //     }
    //
    //     let tokenCheckClear = tokenCheck()
    //
    //     return tokenCheckClear
    // },[authState])

    const router = useRouter()
    // display the tabs screen if the user is authenticated
    useEffect(() => {
        const useProtectedRoute = () => {
            if (authState.authenticated) {
                router.replace('/Home/HomeScreen')
            } else {
                router.replace('/')
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

            return result;
        } catch (err) {
            throw new Error(err)
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

            return result;
        } catch (err) {
            throw new Error(err)
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


            return result;
        } catch (err) {
            throw new Error(err)
        }


    }

    const refreshToken = async () => {
        try {
            const result = await axios.post(`${API_URL}/auth/refresh-token`, {token: authState.token,refreshToken: authState.refreshToken})

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.refreshToken);

            setAuthState({
                token: result.data.value.token,
                refreshToken: result.data.value.refreshToken,
                authenticated: true
            })

            return result;
        } catch (err) {
            throw new Error(err)
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
