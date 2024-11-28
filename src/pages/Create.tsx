import DynamicForm from "@/components/DynamicForm";
import FormService from "@/services/FormService";

const Create = () => {

    return (
        <DynamicForm onActionForm={FormService.createForm} />
    )
}

export default Create;