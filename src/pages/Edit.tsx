import { useParams } from "react-router-dom";
import DynamicForm from "@/components/DynamicForm";
import FormService from "@/services/FormService";

const Edit = () => {
    const { form_id } = useParams();
    return (
        <DynamicForm id={form_id} onActionForm={FormService.editForm} />
    )
}

export default Edit;