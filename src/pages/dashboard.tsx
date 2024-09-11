import { useUser } from '@/core/contexts/user';

export const DashboardPage = () => {
	const { user } = useUser();
	console.log(user);

	return <text>{user!.email}</text>;
};
