import {AuthProvider} from "@/app/context/Auth";
import {UserProvider} from "@/app/context/User";
import {TaskProvider} from "@/app/context/Task";
import {ThemeProvider} from "@/app/context/Theme";
import {StyleProvider} from "@/app/context/Tamagui";

const AppProvider = ({children}: any) => {
	return(
		<AuthProvider>
			<UserProvider>
				<TaskProvider>
					<ThemeProvider>
						<StyleProvider>
							{children}
						</StyleProvider>
					</ThemeProvider>
				</TaskProvider>
			</UserProvider>
		</AuthProvider>
	)
}

export {AppProvider}