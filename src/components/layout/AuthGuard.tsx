import { useGetMeQuery } from "@/app/services/auth/authApi";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../UI/Loader";

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
  }, [data]);

  return <>{isLoading ? <Loader /> : children}</>;
};
