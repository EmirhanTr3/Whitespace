export default function FormError({ errors }: { errors: string[] }) {
    return <ul>
        {errors.map((error) => (
            <li key={error}>{error}</li>
        ))}
    </ul>
}