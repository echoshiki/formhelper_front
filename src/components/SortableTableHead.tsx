import { Button } from "@/components/ui/button"
import { ChevronsUpDown } from "lucide-react"
import { TableHead } from "@/components/ui/table"

interface sortableButtonProps {
    title: string,
    field: string,
    onSetSort: (field: string) => void,
}

export const SortableTableHead = ({title, field, onSetSort}: sortableButtonProps) => {
    return (
        <TableHead>
            <Button 
                variant="outline" 
                className="border-none" 
                onClick={() => onSetSort(field)}>
                {title}&nbsp;
                <ChevronsUpDown size="12" />
            </Button>
        </TableHead>
    )
}