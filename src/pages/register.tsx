import { Container } from '@/components/container';
import { CustomButton } from '@/components/custom-button';
import { InputField } from '@/components/form/input-field';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useRegisterForm } from '@/containers/register/hooks';
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
	const { methods, onSubmit } = useRegisterForm();
	const {
		formState: { isSubmitting },
	} = methods;
	const handleSubmit = methods.handleSubmit(onSubmit);

	return (
		<Container>
			<div className="min-h-screen width-full flex items-center justify-center ">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
						<CardDescription className="text-center">
							Insira suas credenciais para acessar sua conta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...methods}>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<InputField
										control={methods.control}
										label="Nome"
										name="name"
										placeholder="John"
									/>
								</div>
								<div className="space-y-2">
									<InputField
										control={methods.control}
										label="Email"
										name="email"
										placeholder="john@exemplo.com"
									/>
								</div>
								<div className="space-y-2">
									<InputField
										name="password"
										label="Senha"
										type="password"
										placeholder="••••••••"
										control={methods.control}
									/>
								</div>
								<div className="space-y-2">
									<InputField
										name="confirm_password"
										label="Confirmar senha"
										type="password"
										placeholder="••••••••"
										control={methods.control}
									/>
								</div>
								<CustomButton type="submit" loading={isSubmitting} className="w-full">
									Continuar
								</CustomButton>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-2">
						<div className="text-sm text-gray-600">
							Já possui uma conta?{' '}
							<Link to="/login" className="text-blue-600 hover:underline">
								Faça login
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</Container>
	);
};
