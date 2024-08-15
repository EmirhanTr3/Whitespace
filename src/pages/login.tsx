import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { FormState, LoginFormSchema } from "./lib/definitions";
import { FormError } from "./components";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const [state, setState] = useState<FormState>()

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        const validatedFields = LoginFormSchema.safeParse({
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })
        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        } else if (state) {
            setState(undefined)
        }

        const response = await signIn("credentials", {
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            redirect: false
        })

        if (response && response?.ok) {
            router.push("/")
        }
    }

    return <form onSubmit={onSubmit}>
        <label>Email:</label><br />
        <input ref={emailRef} type="text" name="email" /><br />
        {state?.errors?.email && <FormError errors={state.errors.email}/>}

        <label>Password:</label><br />
        <input ref={passwordRef} type="password" name="password" /><br />
        {state?.errors?.password && <FormError errors={state.errors.password}/>}

        <button type="submit">Login</button>
    </form>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)

    if (session) { 
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    return {
        props: {}
    }
}