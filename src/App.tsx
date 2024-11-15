import { Routes, Route, Navigate } from 'react-router-dom';
import { currentUserProps } from '@/services/AuthService';
import useAuthStore from '@/stores/AuthStore';
import RootLayout from '@/layouts/RootLayout';
import MessageHandler from '@/components/MessageHandler';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Form from '@/pages/Form';
import Create from '@/pages/Create';
import Test from '@/pages/Test';
import Submission from '@/pages/Submission';
import SubmissionView from '@/pages/SubmissionView';

interface privateRouteProps {
	element: React.ReactNode,
	currentUser: currentUserProps | null
}

function PrivateRoute({ element, currentUser }: privateRouteProps) {
	return currentUser ? element : <Navigate to="/login" />
}

function App() {
	const { currentUser } = useAuthStore();

	return (
		<RootLayout>
			<MessageHandler />
			<Routes>
				<Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
				<Route path="/" element={<PrivateRoute element={<Home />} currentUser={currentUser} />} />
				<Route path="/profile" element={<PrivateRoute element={<Profile />} currentUser={currentUser} />} />
				<Route path="/forms" element={<PrivateRoute element={<Form />} currentUser={currentUser} />} />
				<Route path="/create" element={<PrivateRoute element={<Create />} currentUser={currentUser} />} />
				<Route path="/submissions/form_id/:form_id" element={<PrivateRoute element={<Submission />} currentUser={currentUser} />} />
				<Route path="/submissions/:id" element={<PrivateRoute element={<SubmissionView />} currentUser={currentUser} />} />
				<Route path="/test" element={<Test />} />
			</Routes>
		</RootLayout>
	)
}

export default App
