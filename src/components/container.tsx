import { ReactNode } from 'react';

export const Container = ({ children }: { children: ReactNode }) => {
	return (
		<div className="bg-gray-100 min-h-[100vh]">
			<div className="p-5 ">{children}</div>
		</div>
	);
};
