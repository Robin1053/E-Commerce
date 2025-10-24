import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import theme from './lib/theme';
import RouteConfig from './routes';
import { authClient } from './lib/client';
import { Navigation } from 'react-router';

export async function App() {

  const NAVIGATION: Navigation = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'page',
      title: 'Page',
      icon: <DashboardIcon />,
    },
    {
      segment: 'page-2',
      title: 'Page 2',
      icon: <TimelineIcon />,
    },
  ]
  const { data: session } = await authClient.getSession()

  return (
    <ReactRouterAppProvider
      theme={theme}
      session={session}
    >
    </ReactRouterAppProvider>
  );
}

export default App;
