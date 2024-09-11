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
import {
	useCreateOrEditPatient,
	usePatients,
	useRemovePatient,
} from '@/containers/patients/hooks';
import { Patient } from '@/containers/patients/types';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CustomButton } from '../custom-button';
import { InputField } from '../form/input-field';
import { TextareaField } from '../form/textarea';
import { Form } from '../ui/form';

export const ClinicPatients = () => {
	const [mode, setMode] = useState<'creating' | Patient>();
	const { data, refreshData } = usePatients();
	const { methods, onSubmit, resetFromPatient } = useCreateOrEditPatient({ refreshData });
	const {
		formState: { isSubmitting },
	} = methods;

	const { clinicId } = useParams();
	const { data: clinic } = useClinic(clinicId!);
	const { userHasPermission } = useClinicPermissions(clinic!);

	const { removeLoading, removePatient } = useRemovePatient();

	return (
		<Card className="mb-6">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Pacientes</CardTitle>
				<Dialog
					open={!!mode}
					onOpenChange={(open) => (open ? setMode('creating') : setMode(undefined))}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							onClick={() => {
								methods.reset({
									name: '',
									contact: '',
									history: '',
								});
							}}>
							<PlusIcon className="mr-2 h-4 w-4 " /> Adicionar paciente
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle className="text-gray-900">Adicionar paciente</DialogTitle>
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
								className="space-y-4 text-gray-900 contents">
								<InputField control={methods.control} name="name" label="Nome" />
								<InputField
									control={methods.control}
									name="contact"
									label="Contato"
									placeholder="paciente@exemplo.com"
								/>
								<TextareaField
									control={methods.control}
									name="history"
									label="Resumo do histórico"
								/>

								<CustomButton type="submit" loading={isSubmitting}>
									{mode === 'creating' ? 'Criar' : 'Editar'} task
								</CustomButton>
							</form>
						</Form>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Nome</TableHead>
							<TableHead>Contato</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data?.map((patient) => (
							<TableRow>
								<TableCell>{patient.name}</TableCell>
								<TableCell>{patient.contact}</TableCell>

								<TableCell>
									{userHasPermission(ClinicUserRole.Doctor) && (
										<CustomButton
											variant="outline"
											size="sm"
											className="mr-2"
											onClick={() => {
												setMode(patient);
												resetFromPatient(patient);
											}}>
											Editar
										</CustomButton>
									)}
									{userHasPermission(ClinicUserRole.Admin) && (
										<CustomButton
											loading={removeLoading === patient.id}
											variant="destructive"
											size="sm"
											onClick={() => {
												removePatient(patient.id);
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
