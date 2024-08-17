import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { FormState, RegisterFormSchema } from "../lib/definitions";
import { Form, FormBackground, FormBox, FormButton, FormField, FormFields, FormHeader } from "../components";
import Head from "next/head";
import Link from "next/link";

export default function Register() {
    const usernameRef = useRef<HTMLInputElement>(null)
    const displaynameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    
    const [state, setState] = useState<FormState>()

    const [failed, setFailed] = useState<Boolean>(false)
    
    async function onSubmit(event: FormEvent) {
        event.preventDefault()

        const validatedFields = RegisterFormSchema.safeParse({
            username: usernameRef.current!.value,
            displayname: displaynameRef.current!.value,
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })
        if (!validatedFields.success) {
            setFailed(false)
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

        if (user.id) {
            router.push("/login")
        } else {
            setFailed(true)
        }
    }

    return <>
        <Head>
            <title>Whitespace - Register</title>
        </Head>
        <FormBackground>
            <FormBox>
                <FormHeader />
                {failed && <p className="text-red-500 list-disc text-sm">A user with provided email already exists.</p>}
                <Form onSubmit={onSubmit}>
                    <FormFields>
                        <FormField ref={usernameRef} name="username" text="USERNAME" error={state?.errors?.username}></FormField>
                        <FormField ref={displaynameRef} name="displayname" text="DISPLAY NAME" error={state?.errors?.displayname}></FormField>
                        <FormField ref={emailRef} name="email" text="EMAIL" error={state?.errors?.email}></FormField>
                        <FormField ref={passwordRef} name="password" type="password" text="PASSWORD" error={state?.errors?.password}></FormField>
                    </FormFields>
                    <FormButton text="Register" />
                </Form>
                <p className="text-stone-200 text-sm">Already have an account? <Link className="text-indigo-400 hover:underline" href="/login">Login</Link></p>
            </FormBox>
        </FormBackground>
    </>
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