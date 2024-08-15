import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { FormState, RegisterFormSchema } from "./lib/definitions";
import { FormError } from "./components";

export default function Register() {
    const usernameRef = useRef<HTMLInputElement>(null)
    const displaynameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    
    const [state, setState] = useState<FormState>()
    
    async function onSubmit(event: FormEvent) {
        event.preventDefault()

        const validatedFields = RegisterFormSchema.safeParse({
            username: usernameRef.current!.value,
            displayname: displaynameRef.current!.value,
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })
        if (!validatedFields.success) {
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        } else if (state) {
            setState(undefined)
        }

        const response = await fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify({
                username: usernameRef.current!.value,
                displayname: displaynameRef.current!.value,
                email: emailRef.current!.value,
                password: passwordRef.current!.value
            }),
            headers: { "Content-Type": "application/json" }
        })
        const user = await response.json()

        if (user) {
            router.push("/login")
        }
    }

    return <form onSubmit={(onSubmit)}>
        <label>Username:</label><br />
        <input ref={usernameRef} type="text" name="username" /><br />
        {state?.errors?.username && <FormError errors={state.errors.username}/>}

        <label>Displayname:</label><br />
        <input ref={displaynameRef} type="text" name="displayname" /><br />
        {state?.errors?.displayname && <FormError errors={state.errors.displayname}/>}

        <label>Email:</label><br />
        <input ref={emailRef} type="text" name="email" /><br />
        {state?.errors?.email && <FormError errors={state.errors.email}/>}

        <label>Password:</label><br />
        <input ref={passwordRef} type="password" name="password" /><br />
        {state?.errors?.password && <FormError errors={state.errors.password}/>}

        <button type="submit">Register</button>
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