import { Container } from '@/components/container';
import { CustomButton } from '@/components/custom-button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLoginForm } from '@/containers/login/hooks';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
	const { methods, onSubmit } = useLoginForm();
	const {
		formState: { isSubmitting },
	} = methods;
	const handleSubmit = methods.handleSubmit(onSubmit);

	return (
		<Container>
			<div className="min-h-screen width-full flex items-center justify-center ">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
						<CardDescription className="text-center">
							Insira suas credenciais para acessar sua conta
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...methods}>
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<FormField
										control={methods.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="john@exemplo.com" {...field} />
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="space-y-2">
									<FormField
										control={methods.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Senha</FormLabel>
												<FormControl>
													<Input type="password" placeholder="••••••••" {...field} />
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<CustomButton loading={isSubmitting} type="submit" className="w-full">
									Continuar
								</CustomButton>
							</form>
						</Form>
					</CardContent>
					<CardFooter className="flex flex-col items-center space-y-2">
						<a href="#" className="text-sm text-blue-600 hover:underline">
							Esqueceu sua senha?
						</a>
						<div className="text-sm text-gray-600">
							Ainda não tem uma conta?{' '}
							<Link to="/register" className="text-blue-600 hover:underline">
								Cadastre-se aqui
							</Link>
						</div>
					</CardFooter>
				</Card>
			</div>
		</Container>
	);
};
