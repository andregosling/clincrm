import { useUser } from '@/core/contexts/user';
import { db } from '@/core/services/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	QueryFieldFilterConstraint,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { useClinic, useClinicPermissions } from '../company/hooks';
import { ClinicUserRole } from '../company/types';
import { Task, TaskStatus } from './types';

export const taskSchema = z.object({
	title: z.string({
		required_error: 'Insira um título',
	}),
	description: z.string({ required_error: 'Insira uma descrição' }),
	limitDate: z
		.string({
			required_error: 'Insira uma data',
		})
		.refine(
			(dateString) => {
				const date = new Date(dateString);
				return !isNaN(date.getTime());
			},
			{
				message: 'Data inválida',
			},
		)
		.transform((dateString) => new Date(dateString).toISOString().substring(0, 10)),
	assignedUser: z.string({ required_error: 'Insira um usuário' }),
	status: z.string(),
});
export type CreateTaskValues = z.infer<typeof taskSchema>;

export const useCreateOrEditTask = ({
	refreshData,
}: {
	refreshData: () => Promise<void>;
}) => {
	const { clinicId } = useParams();
	const methods = useForm<CreateTaskValues>({
		resolver: zodResolver(taskSchema),
	});

	const resetFromTask = (task: Task) => {
		methods.reset({
			title: task.title,
			description: task.description,
			assignedUser: task.assigned,
			limitDate: new Date(task.date_limit).toISOString().substring(0, 10),
			status: task.status,
		});
	};

	const onSubmit = (mode: 'edit' | 'create', task?: Task) => {
		return async (values: CreateTaskValues) => {
			if (mode === 'create') {
				await addDoc(collection(db, `companies/${clinicId}/tasks`), <Task>{
					title: values.title,
					assigned: values.assignedUser,
					description: values.description,
					date_created: new Date().toISOString(),
					date_limit: new Date(values.limitDate).toISOString(),
					status: values.status,
					clinicId: clinicId!,
				});
			} else {
				await updateDoc(doc(db, `companies/${clinicId}/tasks`, task!.id), <Task>{
					...task,
					title: values.title,
					assigned: values.assignedUser,
					description: values.description,
					date_created: new Date().toISOString(),
					date_limit: new Date(values.limitDate).toISOString(),
					status: values.status,
					clinicId: clinicId!,
				});
			}

			refreshData();
		};
	};

	return { methods, onSubmit, resetFromTask };
};

export const useTasks = () => {
	const [data, setData] = useState<Task[]>();
	const { clinicId } = useParams();
	const { data: clinic } = useClinic(clinicId!);
	const { user } = useUser();
	const { userHasPermission } = useClinicPermissions(clinic!);

	const refreshData = async (
		filters?:
			| {
					status?: TaskStatus;
					assignedUser?: string;
					date?: string;
			  }
			| undefined,
	) => {
		const companiesRef = collection(db, `companies/${clinicId}/tasks`);
		try {
			const q = query(
				companiesRef,
				...([
					where(`clinicId`, '==', clinicId),
					filters?.status ? where('status', '==', filters.status) : false,
					filters?.date
						? where('date_limit', '==', new Date(filters.date).toISOString())
						: false,
					filters?.assignedUser ? where('assigned', '==', filters.assignedUser) : false,
					!userHasPermission(ClinicUserRole.Admin)
						? where('assigned', '==', user?.uid)
						: false,
				].filter(Boolean) as QueryFieldFilterConstraint[]),
			);
			const querySnapshot = await getDocs(q);

			const fetchedCompanies: Task[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as Omit<Task, 'id'>;
				fetchedCompanies.push({
					id: doc.id,
					...data,
				});
			});

			setData(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	};

	useEffect(() => {
		refreshData();
	}, [clinicId]);

	return { data, refreshData };
};

export const useRemoveTask = () => {
	const { clinicId } = useParams();
	const [removeLoading, setRemoveLoading] = useState<string>();

	const removeTask = async (id: string) => {
		setRemoveLoading(id);
		await deleteDoc(doc(db, `companies/${clinicId}/tasks`, id));
		setRemoveLoading((newItem) => (newItem === id ? undefined : newItem));
	};

	return { removeLoading, removeTask };
};
