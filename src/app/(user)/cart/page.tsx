import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { CartComponent } from '@/Components/users/CartComponent'
import { prisma } from '@/lib/DB/Prisma'

export default async function CardPage() {

    const session = await auth.api.getSession(
        {
            headers: await headers()
        }
    )
    
    // Lade den Warenkorb mit allen Items UND den zugehörigen Produkten
    const cart = await prisma.cart.findFirst({
        where: {
            userId: session?.user?.id || undefined
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    })

    return (
        <>
            <CartComponent session={session} cart={cart} />
        </>
    )
}