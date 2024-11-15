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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/package/Spinner";
import { useToast } from "@/components/ui/use-toast";

import Header from "@/layouts/Header";
import AuthService, { userProfileProps, updateInfoProps } from "@/services/AuthService";
import { dateFormatter, parseDate } from "@/utils/dateFormatter";
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

	if (loading) {
		return <Spinner size="large" />; // 在加载数据时显示一个加载指示
	}

	return (
		<>
			<Header title="资料" />
			<Card className="pb-2 mt-2">
				<CardHeader>
                    <div className="border-b pb-3">
                        <h1 className="font-semibold text-lg">账户信息</h1>
                        <p className="text-slate-500 text-xs mt-1">账户的基础信息，无法修改变更。</p>
                    </div>
                </CardHeader>
				<CardContent>
					<div className="flex flex-wrap space-y-2">
						<div className="w-full">
							<Label className="">账户</Label>
							<Input type="text" className="bg-gray-200 border-none mt-2" value={userInfo.username} disabled />
						</div>

						<div className="w-full">
							<Label>邮箱</Label>
							<Input type="text" className="bg-gray-200 border-none mt-2" value={userInfo.email} disabled />
						</div>

						<div className="w-full flex space-x-2">
							<div className="w-1/2">
								<Label>余额</Label>
								<Input type="text" className="bg-gray-200 border-none mt-2" value={userInfo.money} disabled />
							</div>
							<div className="w-1/2">
								<Label>积分</Label>
								<Input type="text" className="bg-gray-200 border-none mt-2" value={userInfo.score} disabled />
							</div>
						</div>
					</div>

				</CardContent>
			</Card>

			<Card className="pb-2 mt-2">
				<CardHeader>
                    <div className="border-b pb-3">
                        <h1 className="font-semibold text-lg">个性信息</h1>
                        <p className="text-slate-500 text-xs mt-1">用户个性化信息，可以修改变更。</p>
                    </div>
                </CardHeader>
				<CardContent>
					<div className="flex flex-wrap space-y-2">
						<div className="w-full">
							<Label className="">昵称</Label>
							<Input type="text" name="nickname" className="mt-2" value={userInfo.nickname} onChange={handleInputChange} />
						</div>
						<div className="w-full">
							<Label>性别</Label>
							<Select name="sex" onValueChange={(value) => setUserInfo({ ...userInfo, sex: value })} value={userInfo.sex} >
								<SelectTrigger className="mt-2">
									<SelectValue placeholder="请选择性别" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">男</SelectItem>
									<SelectItem value="1">女</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="w-full">
							<Label className="">手机</Label>
							<Input type="text" name="mobile" className="mt-2" value={userInfo.mobile} onChange={handleInputChange} />
						</div>

						<div className="w-full">
							<Label>生日</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Input type="text" name="birthday" className="mt-2" value={userInfo.birthday} onChange={handleInputChange} />
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
			</Card>

			<Card className="py-5 mt-2">
                <CardContent className="p-0 pl-5">
					<Button onClick={updateProfile}>更新信息</Button>
                </CardContent>
            </Card>
		</>
	);
}

export default Profile;