import { UsersPage } from './users/pages';
import { ManageMoviesPage } from './movies/pages';
import ManageFoodPage from './food/pages/ManageFoodPage';
import { ManageGenresPage } from './genres/pages';

const DashboardPage = () => <div>Dashboard dang duoc hoan thien</div>;
const ManageRoomsPage = () => <div>Quan ly phong chieu dang duoc hoan thien</div>;
const ManageBookingsPage = () => <div>Quan ly dat ve dang duoc hoan thien</div>;

export const adminRoutes = [
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
        name: 'Dashboard',
        icon: 'BarChart3',
      },
      {
        path: 'movies',
        element: <ManageMoviesPage />,
        name: 'Quản lý phim',
        icon: 'Film',
      },
      {
        path: 'genres',
        element: <ManageGenresPage />,
        name: 'Quản lý thể loại',
        icon: 'Trophy',
      },
      {
        path: 'rooms',
        element: <ManageRoomsPage />,
        name: 'Quản lý phòng chiếu',
        icon: 'Armchair',
      },
      {
        path: 'food',
        element: <ManageFoodPage />,
        name: 'Đồ ăn & nước uống',
        icon: 'UtensilsCrossed',
      },
      {
        path: 'users',
        element: <UsersPage />,
        name: 'Quản lý tài khoản',
        icon: 'Users',
      },
      {
        path: 'bookings',
        element: <ManageBookingsPage />,
        name: 'Quản lý đặt vé',
        icon: 'Ticket',
      },
    ],
  },
];
