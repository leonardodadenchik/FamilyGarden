import {createContext, useContext, useEffect} from 'react';
import {useAuthContext} from "@/app/context/Auth";
import axios from "axios";
import {API_URL} from "@/constants/constants";

interface CreateTaskProps {
	childId: number,
	taskName: string,
	goodDescription: string,
	badDescription: string,
	completeDate: string,
	subTasks: {
		subTaskTypeId: number,
		subTaskDescription: string,
		penaltyCredits: number,
		royaltyCredits: number,
	}[]
}

interface CreateTaskResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UpdateTaskProps {
	taskId: number,
	taskName: string,
	goodDescription: string,
	badDescription: string,
	completeDate: string
}

interface UpdateTaskResponse {
	data: any | undefined,
	error: any | undefined,
}

interface UpdateSubTaskResponse {
	data: any | undefined,
	error: any | undefined,
}

interface DeleteSubTaskResponse {
	data: any | undefined,
	error: any | undefined,
}

interface DeleteTaskResponse {
	data: any | undefined,
	error: any | undefined,
}

interface TaskContextProps {
	createTask: (createTaskProps: CreateTaskProps) => Promise<CreateTaskResponse>,

	updateTask: (updateTaskProps: UpdateTaskProps) => Promise<UpdateTaskResponse>,

	// updateSubTask: (subTaskId: number,
	// 				subTaskDescription: string,
	// 				royaltyCredits: number,
	// 				penaltyCredits: number,
	// 				subTaskTypeId: number) => Promise<UpdateSubTaskResponse>,
	//
	// deleteSubTask: (subTaskId: number) => Promise<DeleteSubTaskResponse>,
	//
	// deleteTask: (taskId: number) => Promise<DeleteTaskResponse>,
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const useTaskContext = () => {
	const taskContext = useContext(TaskContext);
	if (!taskContext) {
		throw new Error('useTaskContext must be used within a TaskProvider');
	}
	return taskContext;
}

const TaskProvider = ({children}: any) => {
	//Load and add Token to header
	const {authState} = useAuthContext();
	useEffect(() => {
		if (authState.authenticated == true) {
			axios.defaults.headers.common['authorization'] = `Bearer ${authState.token}`
		}
	}, [authState]);

	//Task Management
	const createTask = async (createTaskProps: CreateTaskProps) => {
		try {
			const result = await axios.post(`${API_URL}/task/create`, createTaskProps);
			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error}
		}


	}

	const updateTask = async (updateTaskProps: UpdateTaskProps) => {
		try {
			const result = await axios.put(`${API_URL}/task/update`, updateTaskProps)
			return {data: result, error: undefined};
		} catch (error) {
			return {data: undefined, error: error};
		}
	}

	const value = {
		createTask,
		updateTask
	}
	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export {
	useTaskContext,
	TaskProvider,

}
