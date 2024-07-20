import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Signup from './components/SignupModal';

import './index.css';

const router = createBrowserRouter([{
    path: '/',
    element: <App page="HomePage" />,
    errorElement: <App page="ErrorPage"/>
},
{
    path: '/password/reset',
    element: <Signup />,
},
{
    path: '/search',
    element: <App page="SearchResults" />
},
{
    path: '/dish/:dishSlug',
    element: <App page="DishPage" />
},
{
    path: '/dish/nationality/:dishNationality',
    element: <App page="NationalityPage" />
},
{
    path: '/account/favourites',
    element: <App page="FavouritesPage" />
}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router}/>
);