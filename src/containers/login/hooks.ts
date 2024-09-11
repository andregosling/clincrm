import { useUser } from '@/core/contexts/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const userSchema = z.object({
	email: z.string().email('Insira um email válido'),
	password: z.string().min(1, 'Insira uma senha válida'),
});

export type LoginFormValues = z.infer<typeof userSchema>;

export const useLoginForm = () => {
	const navigate = useNavigate();
	const { setUser } = useUser();

	const methods = useForm<LoginFormValues>({
		resolver: zodResolver(userSchema),
		mode: 'onBlur',
	});

	const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
		const auth = getAuth();

		try {
			const { user } = await signInWithEmailAndPassword(
				auth,
				values.email,
				values.password,
			);

			setUser(user);
			navigate('/clinics');
		} catch (error: unknown) {
			if (error instanceof FirebaseError) {
				const errorCode = error.code;
				switch (errorCode) {
					case 'auth/invalid-credential':
						methods.setError('password', {
							message: 'Credenciais inválidas',
						});
						break;
				}
			}
		}
	};

	return { methods, onSubmit };
};
