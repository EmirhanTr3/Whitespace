import { useRouter } from "next/router";
import { FormEvent, useRef } from "react";

export default function Register() {
    const usernameRef = useRef<HTMLInputElement>(null)
    const displaynameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const response = await fetch("/api/auth/register", {
            method: 'POST',
            body: JSON.stringify({
                username: usernameRef.current!.value,
                displayname: displaynameRef.current!.value,
                email: emailRef.current!.value,
                password: emailRef.current!.value
            }),
            headers: { "Content-Type": "application/json" }
        })
        const user = await response.json()

        if (user) {
            router.push("/login")
        }
    }

    return <form onSubmit={onSubmit}>
        <label>Username:</label><br />
        <input ref={usernameRef} type="text" name="username" /><br />
        <label>Displayname:</label><br />
        <input ref={displaynameRef} type="text" name="displayname" /><br />
        <label>Email:</label><br />
        <input ref={emailRef} type="text" name="email" /><br />
        <label>Password:</label><br />
        <input ref={passwordRef} type="password" name="password" /><br />
        <button type="submit">Register</button>
    </form>
}