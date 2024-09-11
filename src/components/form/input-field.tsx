import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
	name: Path<T>;
	label: string;
	type?: string;
	placeholder?: string;
	control: Control<T>;
}

export const InputField = <T extends FieldValues>({
	name,
	label,
	type = 'text',
	placeholder,
	control,
}: InputFieldProps<T>) => {
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="w-full flex flex-col">
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="relative w-full flex flex-col">
							<Input
								type={type === 'password' && showPassword ? 'text' : type}
								placeholder={placeholder}
								{...field}
								className={`w-full ${type === 'password' ? 'pr-10' : ''}`}
							/>
							{type === 'password' && (
								<div
									className="absolute flex items-center right-0 cursor-pointer top-0 h-full px-3 py-2 border-none bg-transparent focus:ring-0"
									onClick={togglePasswordVisibility}>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-900" />
									) : (
										<Eye className="h-4 w-4 text-gray-900" />
									)}
									<span className="sr-only">
										{showPassword ? 'Ocultar senha' : 'Mostrar senha'}
									</span>
								</div>
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
