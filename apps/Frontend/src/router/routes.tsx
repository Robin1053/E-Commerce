import { createBrowserRouter,  } from 'react-router';
import { App } from '../app/app';
import LoginPage from '../pages/auth/LoginPage';
import Index from '../pages';

const router = createBrowserRouter([
  {
    Component: App, 
    children: [
      {
        path: '/',
        Component: Index,
        children: [
          {
            path: '/auth/login',
            Component: LoginPage,
          },
        ],
      },
    ],
  },
]);

export default router;