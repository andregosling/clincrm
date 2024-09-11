import { Button } from '@/components/ui/button';
import { useUser } from '@/core/contexts/user';
import { auth } from '@/core/services/firebase/client';
import { ExitIcon } from '@radix-ui/react-icons';
import { signOut } from 'firebase/auth';
import { ChevronLeft, Home, Settings, Stethoscope, Users } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const menuItems = [
	{ name: 'Home', href: '/', icon: Home },
	{ name: 'Clinics', href: '/clinics', icon: Stethoscope },
	{ name: 'Patients', href: '/patients', icon: Users },
	{ name: 'Settings', href: '/settings', icon: Settings },
];

export default function UpdatedLayout({ children }: { children?: React.ReactNode }) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const navigate = useNavigate();
	const { user } = useUser();

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className="flex">
			<aside
				onClick={() => !isSidebarOpen && setIsSidebarOpen(true)}
				className={`
    bg-white min-h-screen  flex-shrink overflow-y-auto 
    transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'w-64' : 'w-16'}
    lg:relative lg:z-auto
  `}>
				<div className="flex flex-col h-full">
					<div
						className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} p-4 border-b w-full`}>
						<Link to="/" className="text-2xl font-bold text-gray-800">
							{isSidebarOpen ? 'MedApp' : 'M'}
						</Link>
						{isSidebarOpen && (
							<Button
								variant="outline"
								onClick={toggleSidebar}
								className="bg-white hover:bg-gray-100 border-none w-8 h-8 text-black p-0">
								<ChevronLeft className="text-gray-600" />
							</Button>
						)}
					</div>

					<nav className="mt-5 flex-1">
						{menuItems.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								className={`flex items-center ${isSidebarOpen ? '' : 'justify-center'} px-4 py-3 text-gray-700 hover:bg-gray-100`}>
								<item.icon className="h-5 w-5" />
								{isSidebarOpen && <span className="ml-3">{item.name}</span>}
							</Link>
						))}
						<div
							onClick={() => {
								signOut(auth).then(() => {
									navigate('/login');
								});
							}}
							className={`flex items-center ${isSidebarOpen ? '' : 'justify-center'} px-4 py-3 text-red-400 hover:bg-gray-100`}>
							<ExitIcon className="h-5 w-5" />
							{isSidebarOpen && <span className="ml-3">Sair</span>}
						</div>
					</nav>
				</div>
			</aside>
			<div className="flex-grow bg-gray-100">{children}</div>
		</div>
	);
}
