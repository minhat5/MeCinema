import { UsersPage } from './users/pages';
import { ManageMoviesPage } from './movies/pages';
import ManageFoodPage from './food/pages/ManageFoodPage';
import { ManageGenresPage } from './genres/pages';
import { ManageShowtimesPage } from './showtimes/pages';
import ManageRoomsPage from './rooms/pages/ManageRoomsPage';
import ManageSeatsPage from './rooms/pages/ManageSeatsPage';
import { ManageCinemasPage } from './cinemas/pages';

export const adminRoutes = [
  {
    path: 'admin',
    children: [
      {
        path: 'cinemas',
        element: <ManageCinemasPage />,
        name: 'Quản lý cụm rạp',
        icon: 'Building2',
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
        path: 'showtimes',
        element: <ManageShowtimesPage />,
        name: 'Quản lý suất chiếu',
        icon: 'CalendarDays',
      },
      {
        path: 'rooms',
        element: <ManageRoomsPage />,
        name: 'Quản lý phòng chiếu',
        icon: 'Armchair',
      },
      {
        path: 'seats',
        element: <ManageSeatsPage />,
        name: 'Quản lý ghế',
        icon: 'Grid3x3',
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
    ],
  },
];
