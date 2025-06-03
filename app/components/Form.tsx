import { FormEvent, forwardRef, ReactNode } from "react";

export function FormBackground({ children }: { children: ReactNode }) {
    return <div className="bg-gray-900 w-full h-full flex justify-center items-center">
        {children}
    </div>
}

export function FormBox({ children }: { children: ReactNode }) {
    return <div className="bg-gray-800 p-7 min-w-[290px] w-max h-max rounded-md flex flex-col items-center gap-4 shadow-xl shadow-black max-h-[95%] overflow-y-auto">
        {children}
    </div>
}

export function FormHeader() {
    return <div className="flex flex-col items-center gap-2">
        <img width={128} height={128} src="/favicon.ico"/>
        <p className="text-white font-medium">Whitespace</p>
    </div>
}

export function Form({ children, onSubmit }: { children: ReactNode,onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
    return <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {children}
    </form>
}

export function FormFields({ children }: { children: ReactNode }) {
    return <div className="flex flex-col gap-0">
        {children}
    </div>
}

export function FormButton({ text }: { text: string }) {
    return <button type="submit" className="text-stone-200 bg-gray-900 rounded-[4px] h-8 text-sm hover:bg-[#101520] cursor-pointer">{text}</button>
}

export const FormField = forwardRef<HTMLInputElement, { name: string, type?: string, text: string, required?: boolean, error?: string[] }>((props, ref) => {
    return <div>
        <label className="text-stone-200 font-semibold text-[11px] pl-[1px]">{props.text} {(props.required ?? true) && <label className="text-red-500">*</label>}</label>
        <input ref={ref} type={props.type ?? "text"} name={props.name} className="rounded-[4px] h-8 outline-none text-sm w-full p-2.5 bg-gray-900 text-stone-200 focus:bg-[#101520]" />
        {props.error && <FormError errors={props.error}/>}
    </div>
})

export function FormError({ errors }: { errors: string[] }) {
    return <ul>
        {errors.map((error) => (
            <li key={error} className="text-red-500 list-disc ml-5 text-sm">{error}</li>
        ))}
    </ul>
}