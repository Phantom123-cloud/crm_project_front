import { useUserByIdQuery } from "@/app/services/users/usersApi";
import { useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const { data } = useUserByIdQuery(id as string);

  return <div></div>;
};

export default User;
