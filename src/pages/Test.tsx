import { create } from "zustand"

interface testStoreProps {
    labelText: string,
    setLabelText: (text: string) => void,
    alertText: string,
    setAlertText: (text: string) => void,
    handleClick: () => void,
}

const useTestStore = create<testStoreProps>(set => ({
    labelText: "",
    setLabelText: (text: string) => set({
        labelText: text
    }),
    alertText: "",
    setAlertText: (text: string) => set({
        alertText: text
    }),
    // 错误：state 上下文是由 set() 方法管理的
    // handleClick: (state: any) => {
    //     alert(state.alertText);
    // }
    handleClick: () => {
        const state = useTestStore.getState();
        alert(state.alertText);
    }
}))

const A = () => {
    const setLabelText = useTestStore((state) => state.setLabelText);
    setLabelText('从 A 组件传来的 Label 值');
    return <B />
}

const B = () => {
    const setAlertText = useTestStore((state) => state.setAlertText);
    setAlertText('从 B 组件传来的 Alert 值');
    return <C />
}

const C = () => {
    const labelText = useTestStore((state) => state.labelText);
    const handleClick = useTestStore((state) => state.handleClick);

    return <button onClick={handleClick}>{labelText}</button>
}

export default A;