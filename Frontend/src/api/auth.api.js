import axiosInstance from "./axios";

export const registerUser = async (user) => {
  const url = "/auth/signup";

  const response = await axiosInstance.post(
    url, 
    user
  ).catch((error) => {
    throw new Error(error.message);
  });
  console.log(response);

  if (response.status !== 201) {
    throw new Error(response.data);
  }

  return response.data;
};

export const loginUser = async (user) => {
  const url = '/auth/login';

  const response = await axiosInstance.post(
    url, 
    user
  ).catch((error) => {
    if (response.status === 401) {
      throw new Error("Invalid credentials");
    }
    throw new Error(error.message);
  });
  console.log(response);

  if (response.status !== 200) {
    throw new Error(response.data);
  }
  return response.data;
};

export const getUser = async () => {
  const url = "/auth";

  const response = await axiosInstance.get(url)
  .catch((error) => {
    throw new Error(error.message);
  });

  if (response.status !== 200) {
    throw new Error(response.status);
  }
  return response.data;
};
