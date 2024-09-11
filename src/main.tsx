import { ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './components/layout';
import ProtectedRoute from './components/protected-route';
import { Toaster } from './components/ui/toaster';
import { UserProvider } from './core/contexts/user';
import './index.css';
import { ClinicPage } from './pages/clinics/clinic';
import { ClinicPatientsPage } from './pages/clinics/clinic-patients';
import { ClinicsPage } from './pages/clinics/clinics';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { UserSettingsPage } from './pages/settings';

type Route = {
	path: string;
	label: string;
	element: JSX.Element;
	withLayout?: boolean;
	protected?: boolean;
};

export const routes: Route[] = [
	{ path: '/', label: 'Login', element: <App /> },
	{ path: '/login', label: 'Login', element: <LoginPage /> },
	{ path: '/register', label: 'Registrar', element: <RegisterPage /> },
	{
		path: '/clinics',
		label: 'Clínicas',
		withLayout: true,
		protected: true,
		element: <ClinicsPage />,
	},
	{
		path: '/clinics/:clinicId',
		label: 'Clínica',
		withLayout: true,
		protected: true,
		element: <ClinicPage />,
	},
	{
		path: '/clinics/:clinicId/patients',
		label: 'Clínica',
		withLayout: true,
		protected: true,
		element: <ClinicPatientsPage />,
	},
	{
		path: '/settings',
		label: 'Configurações',
		withLayout: true,
		protected: true,
		element: <UserSettingsPage />,
	},
];

const resolveElement = (v: Route) => {
	let l: ReactNode = v.element;

	if (v.withLayout) l = <Layout>{l}</Layout>;
	if (v.protected) l = <ProtectedRoute>{l}</ProtectedRoute>;

	return l;
};

const mapper = (v: Route) => ({
	path: v.path,
	element: resolveElement(v),
});

const router = createBrowserRouter(routes.map(mapper));

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UserProvider>
			<RouterProvider router={router} />
			<Toaster />
		</UserProvider>
	</StrictMode>,
);
