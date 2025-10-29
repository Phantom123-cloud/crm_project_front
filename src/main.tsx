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
import Templates from "./pages/RoleTemplates.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "login", element: <Login /> },
      {
        path: "/",
        element: <Main />,
        children: [
          { path: "role-types", element: <RoleTypes /> },
          { path: "roles", element: <Roles /> },
          { path: "role-templates", element: <Templates /> },
          // { path: "projects", element: <Projects /> },
          // { path: "projects/project/:id", element: <Project /> },
          // { path: "/task/:id", element: <Task /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AntUIProvider>
      <RouterProvider router={router} />
    </AntUIProvider>
  </Provider>
);
