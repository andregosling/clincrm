import { db } from '@/core/services/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { Patient } from './types';

export const patientSchema = z.object({
	name: z.string({
		required_error: 'Insira um nome',
	}),
	contact: z
		.string({ required_error: 'Insira uma descrição' })
		.email('Insira um email válido'),
	history: z.string({
		required_error: 'Insira um resumo do histórico',
	}),
});
export type CreatePatientValues = z.infer<typeof patientSchema>;

export const useCreateOrEditPatient = ({
	refreshData,
}: {
	refreshData: () => Promise<void>;
}) => {
	const { clinicId } = useParams();
	const methods = useForm<CreatePatientValues>({
		resolver: zodResolver(patientSchema),
	});

	const resetFromPatient = (patient: Patient) => {
		methods.reset({
			name: patient.name,
			contact: patient.contact,
			history: patient.history,
		});
	};

	const onSubmit = (mode: 'edit' | 'create', patient?: Patient) => {
		return async (values: CreatePatientValues) => {
			if (mode === 'create') {
				await addDoc(collection(db, `companies/${clinicId}/patients`), <Patient>{
					name: values.name,
					contact: values.contact,
					history: values.history,
					clinicId: clinicId!,
				});
			} else {
				await updateDoc(doc(db, `companies/${clinicId}/patients`, patient!.id), <Patient>{
					...patient,
					name: values.name,
					contact: values.contact,
					history: values.history,
					clinicId: clinicId!,
				});
			}

			refreshData();
		};
	};

	return { methods, onSubmit, resetFromPatient };
};

export const usePatients = () => {
	const [data, setData] = useState<Patient[]>();
	const { clinicId } = useParams();

	const refreshData = async () => {
		const companiesRef = collection(db, `companies/${clinicId}/patients`);
		try {
			const q = query(companiesRef, where(`clinicId`, '==', clinicId));
			const querySnapshot = await getDocs(q);

			const fetchedCompanies: Patient[] = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data() as Omit<Patient, 'id'>;
				fetchedCompanies.push({
					id: doc.id,
					...data,
				});
			});

			setData(fetchedCompanies);
		} catch (error) {
			console.error('Error fetching companies:', error);
		}
	};

	useEffect(() => {
		refreshData();
	}, [clinicId]);

	return { data, refreshData };
};

export const useRemovePatient = () => {
	const { clinicId } = useParams();
	const [removeLoading, setRemoveLoading] = useState<string>();

	const removePatient = async (id: string) => {
		setRemoveLoading(id);
		await deleteDoc(doc(db, `companies/${clinicId}/patients`, id));
		setRemoveLoading((newItem) => (newItem === id ? undefined : newItem));
	};

	return { removeLoading, removePatient };
};
