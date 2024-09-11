export enum ClinicUserRole {
	Admin = 'admin',
	Doctor = 'doctor',
	Employee = 'employee',
}

export type Clinic = {
	id: string;
	name: string;
	users: {
		[userId: string]: {
			role: ClinicUserRole;
			email: string;
		};
	};
	userRole: ClinicUserRole;
};
