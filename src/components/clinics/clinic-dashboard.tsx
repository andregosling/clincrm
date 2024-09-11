import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClinic } from '@/containers/company/hooks';
import { Link, useParams } from 'react-router-dom';
import { CustomButton } from '../custom-button';
import { Tasks } from '../tasks/tasks';
import { ClinicUsers } from './clinic-users';

export const ClinicDashboard = () => {
	const { clinicId } = useParams();
	const { data } = useClinic(clinicId!);

	if (!data) return null;

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4 text-gray-900">Clinic Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<Card>
					<CardHeader className="items-start">
						<CardTitle>Pessoas</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-4xl font-bold text-start">
							{Object.keys(data.users).length}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="items-start">
						<CardTitle>Pacientes</CardTitle>
					</CardHeader>
					<CardContent className="items-start flex">
						<Link to="patients">
							<CustomButton className="bg-blue-600 hover:bg-blue-700 items-start">
								Visualizar
							</CustomButton>
						</Link>
					</CardContent>
				</Card>
			</div>

			<Tasks />

			<ClinicUsers data={data} />
		</div>
	);
};
