import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import Error from '@/pages/Error';
import Footer from '@/layouts/Footer';


function App() {
	const { currentUser } = useAuthStore();
	const location = useLocation();

	const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
		return currentUser ? element : (
			<Navigate to="/login" state={{ from: location.pathname }} />
		);
	}
 
	return (
		<RootLayout>
			<MessageHandler />
			<Routes>
				{/* 登录与注册页面 */}
				<Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
				<Route path="/register" element={currentUser ? <Navigate to="/" /> : <Login />} />
				{/* 登录检测 */}
				<Route path="/" element={<PrivateRoute element={<Home />} />} />
				<Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
				<Route path="/forms" element={<PrivateRoute element={<Form />} />} />
				<Route path="/create" element={<PrivateRoute element={<Create />} />} />
				<Route path="/edit/form_id/:form_id" element={<PrivateRoute element={<Edit />} />} />
				<Route path="/submissions/form_id/:form_id" element={<PrivateRoute element={<Submission />} />} />
				<Route path="/submissions/:id" element={<PrivateRoute element={<SubmissionView />} />} />
				{/* 直接访问 */}
				<Route path="/v/:id" element={<View />} />
				<Route path="/404" element={<NotFound />} />
				<Route path="/error" element={<Error />} />
				<Route path="/test" element={<Test />} />
				{/* 捕获所有未定义的路有 */}
				<Route path="*" element={<NotFound />} />
			</Routes>
			{(location.pathname != '/login' && location.pathname != '/register')  && (
				<Footer />
			)}
		</RootLayout>
	)
}

export default App
