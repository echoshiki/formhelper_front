import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  example: string
  exampleRequired: string
}

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);


  console.log(watch("example")) // 监听字段框的输入


  return (
    /* 在提交前用 handleSubmit 验证表单字段 */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 将表单的字段通过 register 方法进行注册 */}
      <input defaultValue="test" {...register("example")} />

      {/* 包含了字段验证规则 required */}
      <input {...register("exampleRequired", { required: true })} />
      {/* 如果验证失败则 return false  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  )
}