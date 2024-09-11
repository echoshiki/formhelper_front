import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Header from "@/layouts/Header"

const SubmissionView = () => {
    return (
        <>
            <Header title="数据详情" />
            <Card className="py-5 mt-2">
                <CardContent>
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>数据项</TableHead>
                                <TableHead>数据值</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>数据项</TableCell>
                                <TableCell>数据值</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

export default SubmissionView;