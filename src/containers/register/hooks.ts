import { useUser } from '@/core/contexts/user';
import { auth } from '@/core/services/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const registerSchema = z
	.object({
		name: z
			.string({
				required_error: 'Insira seu nome',
			})
			.min(3, 'Seu nome deve ter no mínimo 3 caracteres'),
		email: z
			.string({
				required_error: 'Insira seu email',
			})
			.email('Insira um email válido'),
		password: z.string({
			required_error: 'Insira uma senha',
		}),
		confirm_password: z.string({
			required_error: 'Confirme sua senha',
		}),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'As senhas não coincidem',
		path: ['confirm_password'],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const useRegisterForm = () => {
	const { setUser } = useUser();

	const navigation = useNavigate();
	const methods = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				values.email,
				values.password,
			);

			updateProfile(auth.currentUser!, {
				displayName: values.name,
			});

			navigation('/dashboard');
			setUser(user);
		} catch (error: unknown) {
			if (error instanceof FirebaseError) {
				const errorCode = error.code;

				switch (errorCode) {
					case 'auth/email-already-in-use':
						methods.setError('email', {
							message: 'Email já cadastrado',
						});
						break;
				}
			}
		}
	};

	return { methods, onSubmit };
};
