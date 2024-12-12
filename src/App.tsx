import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { currentUserProps } from '@/services/AuthService';
import useAuthStore from '@/stores/AuthStore';
import RootLayout from '@/layouts/RootLayout';
import MessageHandler from '@/components/MessageHandler';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Form from '@/pages/Form';
import Create from '@/pages/Create';
import Edit from '@/pages/Edit';
import Test from '@/pages/Test';
import Submission from '@/pages/Submission';
import SubmissionView from '@/pages/SubmissionView';
import View from '@/pages/View';
import NotFound from '@/pages/404';

interface privateRouteProps {
	element: React.ReactNode,
	currentUser: currentUserProps | null
}

function PrivateRoute({ element, currentUser }: privateRouteProps) {
	const location = useLocation();
	return currentUser ? (
		element 
	): (
		<Navigate to="/login" state={{ from: location.pathname }} />
	);
}

function App() {
	const { currentUser } = useAuthStore();

	return (
		<RootLayout>
			<MessageHandler />
			<Routes>
				<Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
				{/* 登录检测 */}
				<Route path="/" element={<PrivateRoute element={<Home />} currentUser={currentUser} />} />
				<Route path="/profile" element={<PrivateRoute element={<Profile />} currentUser={currentUser} />} />
				<Route path="/forms" element={<PrivateRoute element={<Form />} currentUser={currentUser} />} />
				<Route path="/create" element={<PrivateRoute element={<Create />} currentUser={currentUser} />} />
				<Route path="/edit/form_id/:form_id" element={<PrivateRoute element={<Edit />} currentUser={currentUser} />} />
				<Route path="/submissions/form_id/:form_id" element={<PrivateRoute element={<Submission />} currentUser={currentUser} />} />
				<Route path="/submissions/:id" element={<PrivateRoute element={<SubmissionView />} currentUser={currentUser} />} />
				{/* 直接访问 */}
				<Route path="/v/:id" element={<View />} />
				<Route path="/404" element={<NotFound />} />
				<Route path="/test" element={<Test />} />
			</Routes>
		</RootLayout>
	)
}

export default App
