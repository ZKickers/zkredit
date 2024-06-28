import axiosInstance from "./axios";

const getCSRF = async () => {
  const url = "/csrf-token";

  const response = await axiosInstance.get(url);
  const csrfToken = response.data.csrfToken;
  sessionStorage.setItem("csrfToken", csrfToken);
  return csrfToken;
};

export default getCSRF;
