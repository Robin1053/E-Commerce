import NAVIGATION from '../router/Navigation';
import { Outlet } from 'react-router-dom';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import theme from '../theme/theme';
import Logo from '../../public/Logo.png';
import { authClient } from "../lib/auth-client";



const { data: session } = await authClient.getSession()


export function App() {


  return (
    <ReactRouterAppProvider
      session={session}
      navigation={NAVIGATION}
      theme={theme}
      authentication={authClient}
      branding={{
        homeUrl: '/',
        title: 'Decorify',
        logo: <img src={Logo} alt="Decorify logo" />,
      }}
    >
      <DashboardLayout
        defaultSidebarCollapsed={false}
        
      >
        <Outlet />
      </DashboardLayout>
    </ReactRouterAppProvider>
  );
}

export default App;
