import {createContext, useContext, useEffect, useState} from 'react';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';


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
    onLogout: (refreshToken: string) => Promise<any>
}

const TOKEN_KEY = 'my-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token'
export const API_URL = 'https://familygarden.somee.com/api/v1';
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

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            console.log("stored: token-", token," refreshToken-", refreshToken);

            if (token) {
                axios.defaults.headers.common['authorization'] = `Bearer ${token}`

                setAuthState({
                    token: token,
                    refreshToken: refreshToken,
                    authenticated: true
                })
            }
        }
    })

    const register = async (email: string,
                            password: string,
                            firstName: string,
                            lastName: string,
                            userGenderId: number,
                            userRoleId: number,
                            deviceInformation: string,
                            birthDate: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/register`, {email, password, firstName, lastName, userGenderId, userRoleId, deviceInformation, birthDate});
            setAuthState({
                token: result.data.value.response.token,
                refreshToken: result.data.value.response.refreshToken,
                authenticated: true
            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.response.token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.response.refreshToken);

            return result;
        } catch (err) {
            throw new Error(err)
        }
    }

    const login = async (email: string, password: string, deviceInformation: string) => {
        try {
            const result = await axios.post(`${API_URL}/auth/login`, {email, password, deviceInformation});

            setAuthState({
                token: result.data.value.token,
                refreshToken: result.data.value.refreshToken,
                authenticated: true
            })

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.value.token}`

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.value.token);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.data.value.refreshToken);

            return result;
        } catch (err) {
            throw new Error(err)
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            refreshToken: null,
            authenticated: false
        })
    }


    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
