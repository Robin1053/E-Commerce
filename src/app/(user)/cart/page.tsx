import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { CartComponent } from '@/Components/users/CartComponent'

export default async function CardPage() {

    const session = await auth.api.getSession(
            {
                headers: await headers()
            }
        )

    return (
        <>
        <CartComponent session={session}/>
        </>
    )
}