import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation/Navigation';
import LandingPage from './components/LandingPage/LandingPage';
import GroupList from './components/GroupListPage/GroupList';
import GroupDetails from './components/GroupDetailsPage/GroupDetails';
import CreateGroupForm from './components/CreateGroupForm/CreateGroupForm'

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

// todo: fix this ugly ass syntax (eventually...)
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/groups',
        element: <GroupList />
      },
      {
        path: '/groups/:groupId',
        element: <GroupDetails />
      },
      {
        path: '/groups/new',
        element: <CreateGroupForm />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
