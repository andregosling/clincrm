'use client';

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Textarea } from '../ui/textarea';

interface Props<D extends FieldValues> {
	placeholder?: string;
	label: string;
	className?: string;
	control?: Control<D>;
	name: Path<D>;
	description?: string;
}

export const TextareaField = <D extends FieldValues>({
	placeholder,
	label,
	className,
	control,
	name,
	description,
}: Props<D>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={`${className} flex flex-col `}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Textarea placeholder={placeholder} className="resize-none" {...field} />
					</FormControl>

					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
