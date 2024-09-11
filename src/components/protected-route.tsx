import { useUser } from '@/core/contexts/user';
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
	const { user, isUserLoading } = useUser();

	if (isUserLoading) return <></>;

	if (!user && !isUserLoading) {
		return <Navigate to="/login" />;
	}

	return children;
};

export default ProtectedRoute;
