import { Bars } from "react-loader-spinner";
import LoginRegisterPageHelmet from "../../components/shared/LoginRegisterPageHelmet";

export const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <LoginRegisterPageHelmet pageTitle="Register As Expert" />
      <div className="d-flex justify-content-center align-items-center loading-container">
        <Bars
          height="80"
          width="80"
          color="#7044EB"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossOrigin="anonymous"
      ></script>
    </div>
  );
};
