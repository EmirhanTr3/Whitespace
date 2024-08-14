import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await signIn("credentials", {
            email: emailRef.current!.value,
            password: passwordRef.current!.value,
            redirect: false
        })

        router.push("/")
    }

    return <form onSubmit={onSubmit}>
        <label>Email:</label><br />
        <input ref={emailRef} type="text" name="email" /><br />
        <label>Password:</label><br />
        <input ref={passwordRef} type="password" name="password" /><br />
        <button type="submit">Login</button>
    </form>
}