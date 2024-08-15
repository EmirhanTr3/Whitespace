import { GetServerSidePropsContext } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useRef, useState } from "react";
import { FormState, LoginFormSchema } from "../lib/definitions";
import { Form, FormBackground, FormBox, FormButton, FormField, FormFields, FormHeader } from "../components";
import Head from "next/head";
import Link from "next/link";

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

    return <>
        <Head>
            <title>Whitespace - Login</title>
        </Head>
        <FormBackground>
            <FormBox>
                <FormHeader />
                <Form onSubmit={onSubmit}>
                    <FormFields>
                        <FormField ref={emailRef} name="email" text="EMAIL" error={state?.errors?.email}></FormField>
                        <FormField ref={passwordRef} name="password" type="password" text="PASSWORD" error={state?.errors?.password}></FormField>
                    </FormFields>
                    <FormButton text="Login" />
                </Form>
                <p className="text-stone-200 text-sm">Need an account? <Link className="text-indigo-400 hover:underline" href="/register">Register</Link></p>
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