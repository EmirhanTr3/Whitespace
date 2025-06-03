import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useRef, useState, FormEvent } from "react";
import { FormBackground, FormBox, FormHeader, Form, FormFields, FormField, FormButton } from "~/components";
import { authClient } from "~/lib/auth-client";
import { FormState, RegisterFormSchema } from "~/lib/definitions";
import { prisma } from "~/lib/prisma";

export const Route = createFileRoute('/_auth/register')({
  component: RegisterRoute,
})

const checkIfNameExist = createServerFn()
    .validator(d => d as { name: string })
    .handler(async data => {
        const user = await prisma.user.findUnique({
            where: {
                name: data.data.name
            }
        })

        return user != null
    })

export default function RegisterRoute() {
    const nameRef = useRef<HTMLInputElement>(null)
    const displaynameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    
    const [state, setState] = useState<FormState>()
    const [failed, setFailed] = useState<Boolean>(false)
    
    async function onSubmit(event: FormEvent) {
        event.preventDefault()

        const validatedFields = await RegisterFormSchema.safeParseAsync({
            name: nameRef.current!.value,
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

        if (await checkIfNameExist({ data: { name: nameRef.current!.value } })) return setFailed(true)

        const result = await authClient.signUp.email({
            name: nameRef.current!.value,
            displayname: displaynameRef.current!.value,
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            badges: []
        })

        if (!result.error) {
            router.navigate({ to: "/" })
        } else {
            setFailed(true)
        }
    }

    return <>
        <FormBackground>
            <FormBox>
                <FormHeader />
                {failed && <p className="text-red-500 list-disc text-sm">A user with provided email or username already exists.</p>}
                <Form onSubmit={onSubmit}>
                    <FormFields>
                        <FormField ref={nameRef} name="username" text="USERNAME" error={state?.errors?.name}></FormField>
                        <FormField ref={displaynameRef} name="displayname" text="DISPLAY NAME" error={state?.errors?.displayname}></FormField>
                        <FormField ref={emailRef} name="email" text="EMAIL" error={state?.errors?.email}></FormField>
                        <FormField ref={passwordRef} name="password" type="password" text="PASSWORD" error={state?.errors?.password}></FormField>
                    </FormFields>
                    <FormButton text="Register" />
                </Form>
                <p className="text-stone-200 text-sm">Already have an account? <Link className="text-indigo-400 hover:underline" to="/login">Login</Link></p>
            </FormBox>
        </FormBackground>
    </>
}