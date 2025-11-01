import { Spin } from "antd";

const Loader = () => {
  return (
    <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default Loader;
