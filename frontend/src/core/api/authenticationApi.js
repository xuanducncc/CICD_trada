import axiosAPI, { setNewHeaders } from "./axiosApi";

export async function signUp(email, username, password, first_name, last_name) {
  const response = await axiosAPI.post("users/create/", {
    email,
    username,
    password,
    last_name,
    first_name,
  });
  localStorage.setItem("user", response.data);
  return response;
}

export async function obtainToken({
  username,
  password,
  clientId,
  clientSecret,
  grantType,
}) {
  const response = await axiosAPI.post("oauth/token/", {
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    username,
    password,
  });
  const data = {
    access: response.data.access_token,
    refresh: response.data.refresh_token,
  };
  setNewHeaders(data);
  return data;
}

export async function loginOauth({
  token,
  backend,
  clientId,
  clientSecret,
  grantType,
}) {
  // curl -X POST -d "client_id=<client_id>&client_secret=<client_secret>&grant_type=password&username=<user_name>&password=<password>" http://localhost:8000/auth/token
  const response = await axiosAPI.post("oauth/convert-token/", {
    grant_type: grantType,
    client_id: clientId,
    client_secret: clientSecret,
    backend: backend,
    token,
  });
  const data = {
    access: response.data.access_token,
    refresh: response.data.refresh_token,
  };
  setNewHeaders(data);
  return data;
}

export async function refreshToken({ refreshToken, clientId, clientSecret }) {
  // curl -X POST -d "grant_type=refresh_token&client_id=<client_id>&client_secret=<client_secret>&refresh_token=<your_refresh_token>" http://localhost:8000/auth/token
  const response = await axiosAPI.post("auth/token/", {
    grant_type: "refresh_token",
    client_secret: clientSecret,
    clientId: clientId,
    refresh_token: refreshToken,
  });
  const { data } = response;
  setNewHeaders(data);
  return data;
}

// eslint-disable-next-line
export async function logout(accessToken) {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  // TODO: invalidate token on backend
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};
