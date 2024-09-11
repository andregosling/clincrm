import { onAuthStateChanged, User } from 'firebase/auth';
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { auth } from '../services/firebase/client';

export type UserContextContent = {
	user?: User;
	setUser: Dispatch<SetStateAction<User | undefined>>;
	isUserLoading: boolean;
};

const UserContext = createContext<UserContextContent>({} as UserContextContent);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User>();
	const [isUserLoading, setUserLoading] = useState(true);

	useEffect(() => {
		return onAuthStateChanged(auth, (firebaseUser) => {
			console.log(firebaseUser, '>.');
			if (firebaseUser) setUser(firebaseUser);

			setUserLoading(false);
		});
	}, []);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isUserLoading,
			}}>
			{children}
		</UserContext.Provider>
	);
};
