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

export default () => {
    
    return (
        <>
            <Header title="概览" />
            <div className="w-full flex space-x-2">
                <Card className="w-1/4 my-2" x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-normal text-gray-500">
                            今日数据
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
                            <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32</div>
                    </CardContent>
                </Card>

                <Card className="w-1/4 my-2" x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-normal text-gray-500">
                            表单总计
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z" clipRule="evenodd" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32</div>
                    </CardContent>
                </Card>

                <Card className="w-1/4 my-2" x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-normal text-gray-500">
                            数据总计
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">621</div>
                    </CardContent>
                </Card>

                <Card className="w-1/3 my-2" x-chunk="dashboard-01-chunk-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-normal text-gray-500">
                            可用剩余
                        </CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">5 / 10</div>
                        <Progress className="h-1 mt-2" value={50} />
                    </CardContent>
                </Card>
            </div>

            <div className="w-full mb-2">
                <Card className="">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">
                            最新数据
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="w-full mb-2">
                <Card className="">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">
                            最近表单
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">leffler.carroll在2024-08-02创建的自定义表单</TableCell>
                                    <TableCell>leffler.carroll</TableCell>
                                    <TableCell className="text-right">2024-08-02 16:36:10</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
