import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet } from 'react-router';
import theme from './lib/theme';
import { authClient } from './lib/client';


export async function App() {

  const { data: session } = await authClient.getSession()

  return (
    <ReactRouterAppProvider theme={theme} session={session} >
      <Outlet />
    </ReactRouterAppProvider>

  );
}

export default App;
