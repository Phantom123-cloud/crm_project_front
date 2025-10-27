import { Outlet } from "react-router-dom";
import { AuthGuard } from "./AuthGuard";

const Layout = () => {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
};

export default Layout;
