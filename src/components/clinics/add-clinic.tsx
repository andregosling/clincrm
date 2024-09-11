import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateClinic } from '@/containers/company/hooks';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomButton } from '../custom-button';
import { InputField } from '../form/input-field';
import { Form } from '../ui/form';

const schema = z.object({
	name: z.string({
		required_error: 'Insira um nome',
	}),
});

type FormValues = z.infer<typeof schema>;

export const AddClinic = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { toast } = useToast();

	const methods = useForm<FormValues>({
		resolver: zodResolver(schema),
	});
	const {
		formState: { isSubmitting },
	} = methods;

	const { create } = useCreateClinic();

	const onSubmit = async (data: FormValues) => {
		await create(data.name);
		toast({
			title: 'Clinic added',
			description: `${data.name} has been successfully added.`,
		});
		setIsDialogOpen(false);
		methods.reset();
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<Button className="bg-blue-600 hover:bg-blue-700 text-white">
					<PlusCircle className="mr-2 h-4 w-4" /> Adicionar clínica
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-gray-900">
						Criar nova clínica
					</DialogTitle>
				</DialogHeader>
				<Form {...methods}>
					<form
						className="contents text-gray-700"
						onSubmit={methods.handleSubmit(onSubmit)}>
						<InputField
							control={methods.control}
							name="name"
							label="Nome da clínica"
							placeholder="Minha clínica"
						/>

						<DialogFooter>
							<CustomButton
								loading={isSubmitting}
								type="submit"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white">
								Adicionar clínica
							</CustomButton>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
