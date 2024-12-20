import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useAuthStore from "@/stores/AuthStore";
import { ArrowLeft, CircleUserRound, House, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header({ title }: { title: string }) {
    const { currentUser, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Card className="w-full px-5 py-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Link to="/">
                        <House />
                    </Link>
                    <p className="text-xl font-bold">{title}</p>
                    {location.pathname != '/' ? (
                        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft size="16" />
                        </Button>
                    ) : (
                        <></>
                    )} 
                </div>
                <div>
                    <div className="flex items-center space-x-2">
                        <Link to="/create">
                            <Button color="black" className="w-20 h-8 mr-2 text-xs"> 创建表单 </Button>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                {currentUser?.avatar ? (
                                    <img src={currentUser.avatar} className="w-8 h-8 rounded-full" />
                                ) : (
                                    <CircleUserRound />
                                )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel className="py-3">
                                    <p>{currentUser ? currentUser.username : ""}</p>
                                    <p className="text-slate-600 text-xs font-light">{currentUser ? currentUser.email : ""}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to="/profile">
                                        <p>个人资料</p>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to="/forms">
                                        <p>我的表单</p>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <p>升级额度</p>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="py-3 flex items-center space-x-1">
                                    <LogOut size="16" />
                                    <a href="#" onClick={logout}>注销登录</a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </Card>
    )
}
