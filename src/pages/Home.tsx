import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress";
import Header from "@/layouts/Header";
import React, { useEffect, useState } from "react";
import FormService from "@/services/FormService";
import { Database, Flower, Notebook, Table2 } from "lucide-react";
import { dateFormatter } from "@/utils/dateFormatter";
import SubmissionService from "@/services/SubmissionService";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

// 数据统计卡片
const CountCard = ({ title, count, Icon }: {
    title: string,
    count: number,
    Icon: React.ElementType
}) => {
    return (
        <Card className="w-1/3 mt-2 text-center lg:text-left" x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex lg:flex-row items-center justify-between space-y-0 pt-5 pb-2">
                <CardTitle className="text-xs lg:text-sm font-normal text-gray-500">
                    {title}
                </CardTitle>
                <Icon size="24" className="hidden lg:block" />
            </CardHeader>
            <CardContent className="pb-5">
                <div className="text-3xl font-bold">{count}</div>
            </CardContent>
        </Card>
    )
}

const Home = () => {

    const [homeCount, setHomeCount] = useState<{
        weekSubmissions: number,
        allSubmissions: number,
        allForms: number
    }>({
        weekSubmissions: 0,
        allSubmissions: 0,
        allForms: 0
    });

    // 最近表单
    const [recentForms, setRecentForms] = useState<{
        id: string,
        title: string,
        created_at: string,
    }[]>([]);

    // 最新数据
    const [recentSubmissions, setRecentSubmissions] = useState<{
        id: string,
        username: string,
        submitted_at: string,
    }[]>([]);

    // 获取统计数据
    const fetchCountData = async () => {
        const { data: countData } = await FormService.getDataCount();
        setHomeCount(countData);
    }

    // 获取最近表单
    const fetchFormsData = async () => {
        const {data: { items: recentFormList }} = await FormService.getFormList({
            page: 1,
            page_size: 5,
            sort_field: 'created_at',
            sort_order: 'desc',
            fields: 'id,title,created_at'
        });
        setRecentForms(recentFormList);
    };

    // 获取最新数据
    const fetchSubmissionsData = async () => {
        const {data: recentSubmissionList} = await SubmissionService.getSimpleList();
        setRecentSubmissions(recentSubmissionList);
    };

    useEffect(() => {
        fetchCountData();
        fetchFormsData();
        fetchSubmissionsData();
    }, []);

    return (
        <>
            <Header title="概览" />
            <div className="w-full flex justify-between lg:space-x-2 flex-wrap lg:flex-nowrap">
                <div className="w-full flex flex-nowrap space-x-2 lg:w-3/5">
                    <CountCard title={`本周数据`} count={homeCount.weekSubmissions} Icon={Database} />
                    <CountCard title={`表单总计`} count={homeCount.allForms} Icon={Table2} />
                    <CountCard title={`数据总计`} count={homeCount.allSubmissions} Icon={Notebook} />
                </div>

                <Card className="w-full lg:w-2/5 mt-2" x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-5 pb-2">
                        <CardTitle className="text-xs lg:text-sm font-normal text-gray-500">
                            可用剩余
                        </CardTitle>
                        <Flower size="24" className="w-4 h-4 lg:w-6 lg:h-6" />
                    </CardHeader>
                    <CardContent className="pb-5">
                        <div className="text-xl font-bold">5 / 10</div>
                        <Progress className="h-1 mt-2" value={50} />
                    </CardContent>
                </Card>
            </div>

            <div className="w-full flex flex-wrap lg:flex-nowrap lg:space-x-2">
                <Card className="w-full lg:w-1/2 h-auto mt-2">
                    <CardHeader className="pb-2">
                        <div className="border-b pb-3">
                            <h1 className="font-semibold text-lg">最新数据</h1>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {recentSubmissions.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell className="px-0 text-sm lg:text-sm">
                                            <Link to={`/submissions/${item.id}`} >
                                                <Badge variant={`outline`} className="rounded-sm">{dateFormatter(new Date(item.submitted_at), 'm-d')}</Badge>&nbsp;&nbsp;用户 {item.username} 提交了表单
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="w-full lg:w-1/2 mt-2">
                    <CardHeader className="pb-2">
                        <div className="border-b pb-3">
                            <h1 className="font-semibold text-lg">最近表单</h1>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                {recentForms.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell className="px-0 text-sm lg:text-sm">
                                            <Link to={`/submissions/form_id/${item.id}`} >
                                            <Badge variant={`outline`} className="rounded-sm">{dateFormatter(new Date(item.created_at), 'm-d')}</Badge>&nbsp;&nbsp;{item.title}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default Home;
