import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useClinicUser } from '@/containers/company/hooks';
import { Clinic, ClinicUserRole } from '@/containers/company/types';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomButton } from '../custom-button';
import { InputField } from '../form/input-field';
import { Form } from '../ui/form';
import { roleData } from './clinic-listing';

const schema = z.object({
	email: z
		.string({
			required_error: 'Insira um email',
		})
		.email('Insira um email válido'),
	role: z.string({
		required_error: 'Selecione uma função',
	}),
});

type FormValues = Omit<z.infer<typeof schema>, 'role'> & { role: ClinicUserRole };

export const AddUserToClinic = ({
	data,
	refreshData,
}: {
	data: Clinic;
	refreshData: () => void;
}) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();

	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
	});
	const {
		formState: { isSubmitting },
		control,
	} = methods;

	const { add } = useClinicUser(data);

	const onSubmit = async (data: FormValues) => {
		const result = await add(data.email, data.role);

		if (result === 'invalid-user') {
			methods.setError('email', { message: 'Email inexistente' });
			return;
		}
		toast({
			title: 'Usuário adicionado',
			description: `${data.email} foi adicionado com sucesso à clínica como ${data.role}.`,
		});
		refreshData();
		setIsDialogOpen(false);
		methods.reset();
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					<PlusIcon className="mr-2 h-4 w-4" /> Adicionar pessoa
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-900">
						Adicionar pessoa à clínica
					</DialogTitle>
				</DialogHeader>
				<Form {...methods}>
					<form
						className="contents text-gray-700"
						onSubmit={methods.handleSubmit(onSubmit)}>
						<InputField
							control={methods.control}
							name="email"
							label="Email"
							placeholder="medico@gmail.com"
						/>

						<div className="space-y-2">
							<label htmlFor="role" className="text-sm font-medium text-gray-700">
								Função
							</label>
							<Controller
								name="role"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} defaultValue={field.value}>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecione uma função" />
										</SelectTrigger>
										<SelectContent>
											{Object.values(ClinicUserRole).map((v) => (
												<SelectItem value={v}>{roleData[v].label}</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						<DialogFooter>
							<CustomButton
								loading={isSubmitting}
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white">
								Adicionar pessoa
							</CustomButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
