export default function FormError({ errors }: { errors: string[] }) {
    return <ul>
        {errors.map((error) => (
            <li key={error} className="text-red-500 list-disc ml-5 text-sm">{error}</li>
        ))}
    </ul>
}