import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryProvider } from './app/providers/QueryProvider.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Dùng createBrowserRouter (data router) thay cho BrowserRouter
// để hỗ trợ useBlocker, useNavigation và các data router APIs.
// App.tsx vẫn dùng <Routes> như cũ — chỉ cần bọc qua một route catch-all.
const router = createBrowserRouter([
    {
        path: '*',
        element: (
            <QueryProvider>
                <MantineProvider defaultColorScheme="light">
                    <Notifications position="top-right" zIndex={1000} />
                    <App />
                </MantineProvider>
            </QueryProvider>
        ),
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
