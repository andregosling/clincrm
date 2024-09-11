import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClinics } from '@/containers/company/hooks';
import { ClinicUserRole } from '@/containers/company/types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AddClinic } from './add-clinic';

export const roleData: Record<ClinicUserRole, { bg: string; label: string }> = {
	[ClinicUserRole.Admin]: { bg: 'bg-red-500', label: 'Administrador' },
	[ClinicUserRole.Doctor]: { bg: 'bg-blue-500', label: 'Médico' },
	[ClinicUserRole.Employee]: { bg: 'bg-gray-500', label: 'Funcionário' },
};

export const ClinicListing = () => {
	const { data } = useClinics();

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Minhas clínicas</h1>
				<AddClinic />
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{data?.map((clinic) => (
					<Link to={clinic.id}>
						<Card
							key={clinic.id}
							className="cursor-pointer hover:shadow-lg transition-shadow duration-300">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">{clinic.name}</CardTitle>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</CardHeader>
							<CardContent>
								<Badge className={`${roleData[clinic.userRole].bg}`}>
									{roleData[clinic.userRole].label}
								</Badge>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
};
