import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/core/contexts/user';
import { updateProfile } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { CustomButton } from '../custom-button';
import { InputField } from '../form/input-field';
import { Form } from '../ui/form';

export const UserSettings = () => {
	const { user } = useUser();
	const form = useForm({
		defaultValues: {
			name: user?.displayName || '',
		},
	});
	const {
		formState: { isSubmitting },
	} = form;

	const onSubmit = async (data: { name: string }) => {
		await updateProfile(user!, {
			displayName: data.name,
		});
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<main className="flex-1 p-8 overflow-y-auto text-start">
				<div className="max-w-3xl mx-auto">
					<Card>
						<CardHeader>
							<CardTitle>Perfil do usuário</CardTitle>
						</CardHeader>
						<CardContent>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
									<InputField control={form.control} name="name" label="Nome" />
									<div className="flex justify-start space-x-2">
										<CustomButton type="submit" loading={isSubmitting}>
											Salvar
										</CustomButton>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
};
