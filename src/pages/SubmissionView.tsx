import { IsSure } from "@/components/package/IsSure";
import { Spinner } from "@/components/package/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/layouts/Header"
import SubmissionService, { submissionViewProps } from "@/services/SubmissionService";
import { showToast } from "@/utils/common";
import { Clock, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const SubmissionView = () => {
    const { id } = useParams();
    const [data, setData] = useState<submissionViewProps>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchView = async () => {
        const response = await SubmissionService.getSubmissionView({
            id: Number(id),
        });
        console.log(response);
        setData(response.data);
        if (response.code == 200)
            setLoading(false);
    }

    const handleRemoveSelected = async () => {
        const response = await SubmissionService.removeSubmissionSelected([Number(id)]);
        if (response.code == 200) {
            navigate(-1);
            showToast(response.msg);
        } else {
            showToast(response.msg, 2);
        }
    }

    useEffect(() => {
        fetchView();
    }, []);

    return (
        <>
            {!loading ? (
            <>
                <Header title="数据详情" />
                <Card className="py-5 mt-2">
                    <CardContent>
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>数据项</TableHead>
                                    <TableHead>类型</TableHead>
                                    <TableHead>数据值</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.fields.map((field) => (
                                    <TableRow key={field.id}>
                                        <TableCell>{field.label}</TableCell>
                                        <TableCell>{field.type}</TableCell>
                                        <TableCell>{field.value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} >
                                        <div className="w-full flex justify-between">
                                            <p className="font-normal flex items-center">
                                                <UserRound size="15"/>&nbsp;&nbsp;{data?.username}
                                                &nbsp;&nbsp; <Clock size="15" />&nbsp;&nbsp;{data?.submitted_at}</p>
                                            <IsSure
                                                title="确认删除么？"
                                                description="数据删除之后无法恢复，再次确认，是否需要删除？"
                                                onConfirm={handleRemoveSelected} >
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="flex space-x-1 h-8 text-xs" >
                                                    <Trash2 size="12" />
                                                    <span>删除</span>
                                                </Button>
                                            </IsSure>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </> 
            ) : (
                <Spinner size="large" />
            )}  
        </>
    )
}

export default SubmissionView;