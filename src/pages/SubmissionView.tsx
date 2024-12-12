import { IsSure } from "@/components/package/IsSure";
import { Spinner } from "@/components/package/Spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import Header from "@/layouts/Header"
import SubmissionService, { submissionViewProps } from "@/services/SubmissionService";
import { showToast } from "@/utils/common";
import { Clock, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";




const SubmissionView = () => {
    const { id } = useParams();
    if (!id) return;

    const [submissionData, setSubmissionData] = useState<submissionViewProps>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSubmissionView = async () => {
        try {
            const { data: responseData } = await SubmissionService.getSubmissionView(id);
            setSubmissionData(responseData);
            setLoading(false);
        } catch (e) {
            showToast((e as Error).message);
        }        
    }

    const handleRemoveSelected = async () => {
        const response = await SubmissionService.removeSubmissionSelected([id]);
        if (response.code == 200) {
            navigate(-1);
            showToast(response.msg);
        } else {
            showToast(response.msg, 2);
        }
    }

    const formatValue = (type: any, value: any) => {
        switch (type) {
            case "switch":
                return value ? "是" : "否";
            case "checkbox":
                return JSON.parse(value).join(',');
            default:
                return JSON.parse(value);
        }
    }

    useEffect(() => {
        fetchSubmissionView();
    }, [id]);

    return (
        <>
            {!loading ? (
            <>
                <Header title="数据详情" />
                <Card className="py-5 mt-2">
                    <CardContent>
                        <Table className="border">
                            <TableBody>
                                {submissionData?.fields.map((field) => (
                                    <TableRow key={field.id}>
                                        <TableCell>{field.label}</TableCell>
                                        <TableCell>
                                            {formatValue(field.field_type, field.value)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={3} >
                                        <div className="w-full flex justify-between">
                                            <p className="font-normal flex items-center">
                                                <UserRound size="15"/>&nbsp;&nbsp;{submissionData?.username}
                                                &nbsp;&nbsp; <Clock size="15" />&nbsp;&nbsp;{submissionData?.submitted_at}</p>
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