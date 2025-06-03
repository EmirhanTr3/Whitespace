import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useRef, useState, FormEvent } from 'react'
import { Form, FormBackground, FormBox, FormButton, FormField, FormFields, FormHeader } from '~/components'
import { authClient } from '~/lib/auth-client'
import { FormState, LoginFormSchema } from '~/lib/definitions'

export const Route = createFileRoute('/_auth/login')({
  component: LoginRoute,
})

export default function LoginRoute() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const [state, setState] = useState<FormState>()
    const [failed, setFailed] = useState<Boolean>(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        const validatedFields = LoginFormSchema.safeParse({
            email: emailRef.current!.value,
            password: passwordRef.current!.value
        })
        if (!validatedFields.success) {
            setFailed(false)
            return setState({ errors: validatedFields.error.flatten().fieldErrors })
        } else if (state) {
            setState(undefined)
        }

        const result = await authClient.signIn.email({
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
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
                {failed && <p className="text-red-500 list-disc text-sm">Invalid email or password provided.</p>}
                <Form onSubmit={onSubmit}>
                    <FormFields>
                        <FormField ref={emailRef} name="email" text="EMAIL" error={state?.errors?.email}></FormField>
                        <FormField ref={passwordRef} name="password" type="password" text="PASSWORD" error={state?.errors?.password}></FormField>
                    </FormFields>
                    <FormButton text="Login" />
                </Form>
                <p className="text-stone-200 text-sm">Need an account? <Link className="text-indigo-400 hover:underline" to="/register">Register</Link></p>
            </FormBox>
        </FormBackground>
    </>
}