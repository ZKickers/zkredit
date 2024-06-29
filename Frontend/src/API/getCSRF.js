import axiosInstance from "./axios";

const getCSRF = async () => {
  const url = "/csrf-token";

  // const response = await axiosInstance.get(url);
  const csrfToken = "betngana";
  // sessionStorage.setItem("csrfToken", csrfToken);
  return csrfToken;
};

export default getCSRF;
