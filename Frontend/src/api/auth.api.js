import { ZKREDIT_API } from "config";

export const registerUser = async (user) => {
  const url = `${ZKREDIT_API}/auth/signup`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
  }).catch((error) => {
    throw new Error("Problem connecting with the server!");
  });

  if (response.status !== 200) {
    const message = await response.text();
    throw new Error(message);
    // console.log(response)
  }

  return response;
};

export const loginUser = async (user) => {
  const url = `${ZKREDIT_API}/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
  }).catch((error) => {
    throw new Error("Problem connecting with the server!");
  });

  if (response.status === 401) {
    throw new Error("Invalid credentials");
  } else if (response.status !== 200) {
    throw new Error(response.status);
  }
  return response;
};

export const getUser = async (token) => {
  const url = `${ZKREDIT_API}/auth`;

  const response = await fetch(url, {
    method: "GET",
    headers: { Authorization: `${token}` },
  });

  if (response.status !== 200) {
    throw new Error(response.status);
  }
  const user = await response.json();
  return user;
};
