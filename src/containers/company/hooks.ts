import { useUser } from '@/core/contexts/user';
import { db } from '@/core/services/firebase/client';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clinic, ClinicUserRole } from './types';

export const useClinics = () => {
	const [data, setData] = useState<Clinic[]>([]);
	const [isLoading, setLoading] = useState(true);
	const { user } = useUser();

	useEffect(() => {
		if (!user) return;

		(async () => {
			const companiesRef = collection(db, 'companies');
			try {
				const q = query(
					companiesRef,
					where(`users.${user.uid}.role`, 'in', Object.values(ClinicUserRole)),
				);
				const querySnapshot = await getDocs(q);

				const fetchedCompanies: Clinic[] = [];
				querySnapshot.forEach((doc) => {
					const data = doc.data() as Omit<Clinic, 'id'>;
					fetchedCompanies.push({
						id: doc.id,
						...data,
						userRole: data.users[user.uid].role,
					});
				});

				setLoading(false);
				setData(fetchedCompanies);
			} catch (error) {
				console.error('Error fetching companies:', error);
			}
		})();
	}, [user]);

	return { data, isLoading };
};

export const useClinic = (clinicId: string) => {
	const [data, setData] = useState<Clinic | null>(null);
	const [isLoading, setLoading] = useState(true);
	const { user } = useUser();

	const refreshData = async () => {
		if (!user || !clinicId) return;

		const clinicRef = doc(db, 'companies', clinicId);
		try {
			const clinicSnapshot = await getDoc(clinicRef);

			if (clinicSnapshot.exists()) {
				const clinicData = clinicSnapshot.data() as Omit<Clinic, 'id'>;

				if (
					clinicData.users[user.uid] &&
					Object.values(ClinicUserRole).includes(clinicData.users[user.uid].role)
				) {
					setData({
						id: clinicSnapshot.id,
						...clinicData,
						userRole: clinicData.users[user.uid].role,
					});
				}
			}

			setLoading(false);
		} catch (error) {
			console.error('Error fetching clinic data:', error);
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshData();
	}, [user, clinicId]);

	return { data, isLoading, refreshData };
};

export const useCreateClinic = () => {
	const { user } = useUser();
	const navigate = useNavigate();

	const create = async (name: string) => {
		if (!user) return;

		const docRef = await addDoc(collection(db, 'companies'), <Clinic>{
			name,
			users: {
				[user.uid]: {
					role: ClinicUserRole.Admin,
					email: user.email,
				},
			},
		});

		navigate(docRef.id);
	};

	return { create };
};

export const useClinicUser = (data: Clinic) => {
	const { user } = useUser();
	const { clinicId } = useParams();
	const companyRef = doc(db, 'companies', clinicId!);

	const add = async (email: string, role: ClinicUserRole) => {
		if (!user) return;

		try {
			const userUid = await fetch(
				`${import.meta.env.VITE_FUNCTIONS_URL}/api/userIdByEmail?email=${email}`,
			);

			const { uid } = await userUid.json();

			await updateDoc(companyRef, <Clinic>{
				...data,
				users: <Clinic['users']>{
					...data.users,
					[uid]: {
						email,
						role,
					},
				},
			});
		} catch {
			return 'invalid-user';
		}
	};

	const setPermissions = async (id: string, permission: ClinicUserRole) => {
		await updateDoc(companyRef, <Clinic>{
			...data,
			users: <Clinic['users']>{
				...data.users,
				[id]: {
					...data.users[id],
					role: permission,
				},
			},
		});
	};

	return { add, setPermissions };
};

export const useClinicPermissions = (clinic: Clinic) => {
	const { user } = useUser();

	const userPermission = user ? clinic?.users[user.uid].role : ClinicUserRole.Employee;
	return {
		userHasPermission(permission: ClinicUserRole) {
			if (!clinic) return;
			switch (permission) {
				case ClinicUserRole.Admin:
					return userPermission === ClinicUserRole.Admin;
				case ClinicUserRole.Doctor:
					return [ClinicUserRole.Admin, ClinicUserRole.Doctor].includes(userPermission);
				case ClinicUserRole.Employee:
					return [
						ClinicUserRole.Admin,
						ClinicUserRole.Doctor,
						ClinicUserRole.Employee,
					].includes(userPermission);
			}
		},
	};
};
