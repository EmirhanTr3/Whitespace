import { forwardRef } from "react"
import { FormError } from "."

export function Modal(
    { title, confirmLabel, confirmCallback, cancelCallback, children }:
    { title: string, confirmLabel: string, confirmCallback: () => void, cancelCallback: () => void, children: JSX.Element }
) {
    return <div className="fixed inset-0 z-10 w-full h-full bg-neutral-900 bg-opacity-80 flex items-center justify-center">
        <div className="w-[350px] bg-neutral-800 shadow-xl shadow-neutral-900 flex flex-col items-center rounded-sm p-4 gap-4">
            <p className="text-neutral-200 text-2xl font-semibold">{title}</p>
            {children}
            <div className="w-full flex justify-between">
                <button type="submit" onClick={() => cancelCallback()} className="text-stone-200 bg-neutral-900 rounded-[4px] text-sm hover:bg-[#1a1a1a] px-5 py-2">Cancel</button>
                <button type="submit" onClick={() => confirmCallback()} className="text-stone-200 bg-neutral-900 rounded-[4px] text-sm hover:bg-[#1a1a1a] px-5 py-2">{confirmLabel}</button>
            </div>
        </div>
    </div>
}

export const ModalInputField = forwardRef<HTMLInputElement, { name: string, defaultValue?: string, error?: string[] }>((props, ref) => {
    return <div className="w-full">
        <label className="text-stone-300 text-sm pl-[1px]">{props.name}</label>
        <input ref={ref} type="text" defaultValue={props.defaultValue} className="rounded-[4px] h-9 outline-none text-sm w-full p-2.5 bg-neutral-900 text-stone-200 focus:bg-[#1a1a1a]" />
        {props.error && <FormError errors={props.error}/>}
    </div>
})