import { Session } from '@/lib/auth-client'
import Typography from '@mui/material/Typography'



function YourOrdersComponent({ session }: { session: Session | null }) {
    {
        return (
            <>
                <Typography variant="h1" color='tertiary'>Here will come a Your Orders Page</Typography>
                <Typography variant="body1">User Email: {session?.user?.email ?? 'No user logged in'}</Typography>
            </>
        )
    }
}


export { YourOrdersComponent }