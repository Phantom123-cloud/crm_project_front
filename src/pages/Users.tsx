import { Outlet, useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Outlet />
      {/* <div className="grid gap-10">
        <button onClick={() => navigate("register")}>register</button>
        <button onClick={() => navigate("accounts")}>data</button>
      </div> */}
    </div>
  );
};

export default Users;
