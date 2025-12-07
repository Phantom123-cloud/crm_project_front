import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/layout/Main.tsx";
import Layout from "./components/layout/Layout.tsx";
import Login from "./pages/Login.tsx";
import { AntUIProvider } from "./UIContext.tsx";
import RoleTypes from "./pages/RoleTypes.tsx";
import Roles from "./pages/Roles.tsx";
import RoleTemplates from "./pages/RoleTemplates.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Citizenships from "./pages/Citizenships.tsx";
import Languages from "./pages/Languages.tsx";
import Users from "./pages/Users.tsx";
import RegisterUsers from "./pages/RegisterUsers.tsx";
import User from "./pages/User.tsx";
import TripTypes from "./pages/TripTypes.tsx";
import Trips from "./pages/Trips.tsx";
import CreateTrips from "./pages/CreateTrips.tsx";
import Warehouses from "./pages/Warehouses.tsx";
import Products from "./pages/Products.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      {
        element: <Main />,
        path: "/",
        children: [
          { path: "role-types", element: <RoleTypes /> },
          { path: "roles", element: <Roles /> },
          { path: "role-templates", element: <RoleTemplates /> },
          { path: "citizenships", element: <Citizenships /> },
          { path: "languages", element: <Languages /> },
          {
            path: "users",
            element: <Users />,
            children: [{ path: "register", element: <RegisterUsers /> }],
          },
          { path: "user/:id", element: <User /> },
          { path: "trip-types", element: <TripTypes /> },
          {
            path: "trips",
            element: <Trips />,
            children: [{ path: "create", element: <CreateTrips /> }],
          },
          {
            path: "warehouses",
            element: <Warehouses />,
          },
          {
            path: "products",
            element: <Products />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AntUIProvider>
      <RouterProvider router={router} />
    </AntUIProvider>
  </Provider>
);
