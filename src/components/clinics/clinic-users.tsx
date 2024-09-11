import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClinicPermissions, useClinicUser } from '@/containers/company/hooks';
import { Clinic, ClinicUserRole } from '@/containers/company/types';
import { useUser } from '@/core/contexts/user';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { AddUserToClinic } from './add-user-to-clinic';
import { roleData } from './clinic-listing';

export const ClinicUsers = ({ data }: { data: Clinic }) => {
	const { user: currentUser } = useUser();

	const { setPermissions } = useClinicUser(data);

	const { userHasPermission } = useClinicPermissions(data);
	//
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Pessoas na clínica</CardTitle>
				{userHasPermission(ClinicUserRole.Admin) && <AddUserToClinic data={data} />}
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Role</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(data.users).map(([user, { email, role }]) => (
							<TableRow key={user}>
								<TableCell className="font-medium text-start">{email}</TableCell>
								<TableCell className="w-48 text-start">
									{userHasPermission(ClinicUserRole.Admin) &&
									user !== currentUser?.uid ? (
										<div className="relative">
											<Select
												defaultValue={role}
												onValueChange={(v: ClinicUserRole) => {
													setPermissions(user, v);
												}}>
												<SelectTrigger
													className="w-full px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50"
													type="button">
													<SelectValue />
												</SelectTrigger>
												<SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg">
													{Object.values(ClinicUserRole).map((roleOption) => (
														<SelectItem
															key={roleOption}
															value={roleOption}
															className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
															{roleData[roleOption].label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									) : (
										<span className="px-3 py-1 text-sm font-medium text-gray-700">
											{roleData[role].label}
										</span>
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
