import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Вы перешли на неизвестный сайту маршрут."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Назад
        </Button>
      }
    />
  );
};

export default ErrorPage;
