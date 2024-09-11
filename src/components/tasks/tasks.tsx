import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useClinic, useClinicPermissions } from '@/containers/company/hooks';
import { ClinicUserRole } from '@/containers/company/types';
import { useCreateOrEditTask, useRemoveTask, useTasks } from '@/containers/tasks/hooks';
import { Task, TaskStatus } from '@/containers/tasks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { CustomButton } from '../custom-button';
import { InputField } from '../form/input-field';
import { SelectField } from '../form/select';
import { TextareaField } from '../form/textarea';
import { Form } from '../ui/form';

export const Tasks = () => {
	const [mode, setMode] = useState<'creating' | Task>();
	const { data, refreshData } = useTasks();
	const { methods, onSubmit, resetFromTask } = useCreateOrEditTask({ refreshData });
	const {
		formState: { isSubmitting },
	} = methods;

	const { clinicId } = useParams();
	const { data: clinic } = useClinic(clinicId!);
	const { userHasPermission } = useClinicPermissions(clinic!);

	const { removeLoading, removeTask } = useRemoveTask();

	const filteringMethods = useForm<{
		status: TaskStatus;
		assignedUser: string;
		date: string;
	}>({
		resolver: zodResolver(z.object({})),
	});
	const filters = useWatch({ control: filteringMethods.control });

	useEffect(() => {
		const timeout = setTimeout(() => {
			refreshData(filters);
		}, 500);

		return () => {
			clearTimeout(timeout);
		};
	}, [filters]);

	return (
		<Card className="mb-6">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Tarefas</CardTitle>
				<Dialog
					open={!!mode}
					onOpenChange={(open) => (open ? setMode('creating') : setMode(undefined))}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							onClick={() => {
								methods.reset({
									title: '',
									description: '',
									assignedUser: '',
									status: '',
									limitDate: '',
								});
							}}>
							<PlusIcon className="mr-2 h-4 w-4 " /> Adicionar tarefa
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="text-gray-900">Criar nova tarefa</DialogTitle>
						</DialogHeader>
						<Form {...methods}>
							<form
								onSubmit={methods.handleSubmit(async (data) => {
									const fn = onSubmit(
										mode === 'creating' ? 'create' : 'edit',
										mode && mode !== 'creating' ? mode : undefined,
									);
									await fn(data);

									setMode(undefined);
								})}
								className="space-y-4 text-gray-900 contents text-start items-start">
								<InputField control={methods.control} name="title" label="Título" />
								<InputField
									control={methods.control}
									name="limitDate"
									label="Data limite"
									type="date"
								/>
								<TextareaField
									control={methods.control}
									name="description"
									label="Descrição"
								/>
								<SelectField
									control={methods.control}
									name="status"
									label="Status"
									items={[
										{ label: 'Pendente', value: TaskStatus.Pending },
										{ label: 'Concluído', value: TaskStatus.Done },
									]}
								/>
								<SelectField
									control={methods.control}
									name="assignedUser"
									label="Responsável"
									items={
										clinic
											? Object.entries(clinic.users).map(([userId, { email }]) => ({
													label: email,
													value: userId,
												}))
											: []
									}
								/>
								<CustomButton
									type="submit"
									className="bg-blue-600 hover:bg-blue-700"
									loading={isSubmitting}>
									{mode === 'creating' ? 'Criar' : 'Editar'} tarefa
								</CustomButton>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				<div className="mb-4 flex flex-wrap gap-4">
					<Form {...filteringMethods}>
						<form className="contents">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<SelectField
									name="status"
									label="Status"
									control={filteringMethods.control}
									items={[
										{ label: 'Pendente', value: TaskStatus.Pending },
										{ label: 'Concluído', value: TaskStatus.Done },
									]}
								/>
								{userHasPermission(ClinicUserRole.Admin) && (
									<SelectField
										control={filteringMethods.control}
										name="assignedUser"
										label="Responsável"
										items={
											clinic
												? Object.entries(clinic.users).map(([userId, { email }]) => ({
														label: email,
														value: userId,
													}))
												: []
										}
									/>
								)}
								<InputField
									name="date"
									label="Data"
									type="date"
									control={filteringMethods.control}
								/>
							</div>
						</form>
					</Form>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Assignee</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((task) => (
							<TableRow key={task.id}>
								<TableCell className="text-start">{task.title}</TableCell>
								<TableCell className="text-start">{task.description}</TableCell>
								<TableCell className="text-start">
									{new Date(task.date_created).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-start">
									{new Date(task.date_limit).toLocaleDateString()}
								</TableCell>
								<TableCell className="text-start">
									{task.status === TaskStatus.Done ? 'Concluído' : 'Pendente'}
								</TableCell>
								<TableCell className="text-start">
									{clinic?.users[task.assigned].email}
								</TableCell>
								<TableCell className="text-start">
									{userHasPermission(ClinicUserRole.Doctor) && (
										<CustomButton
											variant="outline"
											size="sm"
											className="mr-2"
											onClick={() => {
												setMode(task);
												resetFromTask(task);
											}}>
											Editar
										</CustomButton>
									)}
									{userHasPermission(ClinicUserRole.Admin) && (
										<CustomButton
											loading={removeLoading === task.id}
											variant="destructive"
											size="sm"
											onClick={() => {
												removeTask(task.id);
												refreshData();
											}}>
											Remover
										</CustomButton>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
