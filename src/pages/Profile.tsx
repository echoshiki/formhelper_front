import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/package/Spinner";
import { useToast } from "@/components/ui/use-toast";

import Header from "@/layouts/Header";
import AuthService, { userProfileProps, updateInfoProps } from "@/services/AuthService";
import dateFormatter from "@/utils/dateFormatter";
import { useEffect, useState } from "react";

const Profile = () => {

	const [userInfo, setUserInfo] = useState<userProfileProps>({
		id: 0,
		username: '',
		nickname: '',
		email: '',
		avatar: '',
		mobile: '',
		sex: '',
		birthday: '',
		money: 0,
		score: 0,
		created_at: '',
		updated_at: ''
	});

	const [loading, setLoading] = useState(true); // 新增 loading 状态
	const { toast } = useToast();


	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUserInfo({
			...userInfo, // 保留已有的字段值
			[name]: value, // 更新当前修改的字段
		});
	};

	const handleDateSelect = (selectedDate: Date | undefined) => {
		// 这里处理日期的逻辑
		if (selectedDate) {
			// 时间格式统一
			const formattedDate = dateFormatter(selectedDate);
			setUserInfo({
				...userInfo, // 保留已有的字段值
				birthday: formattedDate, // 更新当前修改的字段
			});
		}
	};

	async function sysncProfile() {
		const response = await AuthService.syncUser();
		if (response.code == 200) {
			const userInfo = {
				id: response.info.id,
				username: response.info.username,
				nickname: response.info.nickname,
				avatar: response.info.avatar,
				email: response.info.email,
				mobile: response.info.mobile,
				money: response.info.money,
				score: response.info.score,
				sex: response.info.sex,
				birthday: response.info.birthday,
				created_at: response.info.join_time,
				updated_at: response.info.last_time
			}
			setUserInfo(userInfo);
		}
		setLoading(false);	
	}

	async function updateProfile() {
		const updateInfo: updateInfoProps = {
			nickname: userInfo.nickname,
			sex: userInfo.sex,
			birthday: userInfo.birthday,
			mobile: userInfo.mobile
		}
		const response = await AuthService.updateUser(updateInfo);
		if (response.code == 200) {
			toast({
                title: "提示",
                description: response.msg,
            });
		} else {
			toast({
                title: "提示",
                description: response.msg,
            });
		}
	}

	useEffect(() => {
		sysncProfile();
	}, []);

	const parseDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return isNaN(date.getTime()) ? new Date() : date; // 如果日期无效，返回当前日期
	};

	if (loading) {
		return <Spinner size="large" />; // 在加载数据时显示一个加载指示
	}

	return (
		<>
			<Header title="资料" />
			<Card className="py-5 mt-2">
				<CardContent className="space-y-3">

					<div className="flex space-x-10">
						<div className="w-1/2 space-y-1">
							<Label className="">账户</Label>
							<Input type="text" className="bg-gray-300 border-none" value={userInfo.username} disabled />
						</div>
						<div className="w-1/2 space-y-1">
							<Label>邮箱</Label>
							<Input type="text" className="bg-gray-300 border-none" value={userInfo.email} disabled />
						</div>
					</div>

					<div className="flex space-x-10">
						<div className="w-1/2 space-y-1">
							<Label className="">余额</Label>
							<Input type="text" className="bg-gray-300 border-none" value={userInfo.money} disabled />
						</div>
						<div className="w-1/2 space-y-1">
							<Label>积分</Label>
							<Input type="text" className="bg-gray-300 border-none" value={userInfo.score} disabled />
						</div>
					</div>

					<div className="flex space-x-10">
						<div className="w-1/2 space-y-1">
							<Label className="">昵称</Label>
							<Input type="text" name="nickname" className="bg-gray-100 border-none" value={userInfo.nickname} onChange={handleInputChange} />
						</div>
						<div className="w-1/2 space-y-1">
							<Label>性别</Label>
							<Select name="sex" onValueChange={(value) => setUserInfo({ ...userInfo, sex: value })} value={userInfo.sex} >
								<SelectTrigger className="bg-gray-100">
									<SelectValue placeholder="请选择性别" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">男</SelectItem>
									<SelectItem value="1">女</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="flex space-x-10">
						<div className="w-1/2 space-y-1">
							<Label className="">手机</Label>
							<Input type="text" name="mobile" className="bg-gray-100 border-none" value={userInfo.mobile} onChange={handleInputChange} />
						</div>
						<div className="w-1/2 space-y-1">
							<Label>生日</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Input type="text" name="birthday" className="bg-gray-100 border-none" value={userInfo.birthday} onChange={handleInputChange} />
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={parseDate(userInfo.birthday)}
										onSelect={handleDateSelect}
										defaultMonth={parseDate(userInfo.birthday)}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
					</div>

				</CardContent>
				<CardFooter className="border-t px-6 py-4">
					<Button onClick={updateProfile}>立即修改</Button>
				</CardFooter>
			</Card>
		</>
	);
}

export default Profile;