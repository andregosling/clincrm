'use client';

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ReactNode } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

interface Props<D extends FieldValues> {
	placeholder?: string;
	label?: string;
	items: { label: ReactNode; value: string }[];
	className?: string;
	control: Control<D>;
	name: Path<D>;
	description?: string;
	skeletonMode?: boolean;
}

export const SelectField = <D extends FieldValues>({
	placeholder,
	label,
	items,
	className,
	control,
	name,
	description,
	skeletonMode,
}: Props<D>) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={`${className} flex flex-col h-full`}>
					{label && <FormLabel>{label}</FormLabel>}

					<Select onValueChange={field.onChange} value={field.value}>
						<FormControl>
							<SelectTrigger className={`w-full ${skeletonMode ? 'is-skeleton' : ''}`}>
								<SelectValue placeholder={placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{items.map((item, index) => (
								<SelectItem key={index} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{description && (
						<FormDescription className={skeletonMode ? 'is-skeleton' : ''}>
							{description}
						</FormDescription>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
