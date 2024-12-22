import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import useAuthStore from "@/stores/AuthStore";
import { ArrowLeft, CircleUserRound, House, LogOut, LucideMenu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
  } from "@/components/ui/drawer"

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
                    <p className="text-lg lg:text-xl font-bold">{title}</p>
                    {location.pathname != '/' ? (
                        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                            <ArrowLeft size="16" />
                        </Button>
                    ) : (
                        <></>
                    )} 
                </div>
                <div>
                    {/* 移动端布局 */}
                    <Drawer>
                        <DrawerTrigger className="flex items-center lg:hidden">
                            <LucideMenu size="24" />
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader className="flex justify-between items-center">
                                <div className="">
                                    <p className="text-xl font-bold text-left">{currentUser?.username}</p>
                                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                                </div>
                                <div className="">
                                    {currentUser?.avatar && (
                                        <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />
                                    )}
                                </div>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button onClick={() => navigate('/create')}>创建</Button>
                                <Button variant={`outline`} onClick={() => navigate('/forms')}>表单</Button>
                                <div className="flex justify-between mt-2">
                                    <Button onClick={() => navigate('/profile')} className="underline" variant={`link`}>个人资料</Button>
                                    <Button variant={`link`} onClick={logout}>
                                        <LogOut size="16" />
                                        &nbsp;登出
                                    </Button>
                                </div>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                    {/* 大屏幕布局 */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <Link to="/create">
                            <Button color="black" size="sm" className="mr-2 text-xs block"> 创建表单 </Button>
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
