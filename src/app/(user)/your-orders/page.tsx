import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {YourOrdersComponent} from "@/Components/users/YourOrdersComponent"


export default async function YourOrdersPage() {


    const session = await auth.api.getSession(
        {
            headers: await headers()
        }
    )
    return(
        <YourOrdersComponent session={session} />
    )
}