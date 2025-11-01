import { useGetMeQuery } from "@/app/services/auth/authApi";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../UI/Loader";
import Login from "@/pages/Login";

type Props = { children: React.ReactNode };
export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { data, isLoading, isError } = useGetMeQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isLoading && (!data || isError)) {
      navigate("/login");
    }
  }, [isLoading]);

  useEffect(() => {
    if (data && pathname === "/login") {
      navigate("/");
    }
  }, [data, isLoading]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !data) {
    return <Login />;
  }

  return <>{isLoading ? <Loader /> : children}</>;
};
