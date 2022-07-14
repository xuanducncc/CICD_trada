import React from 'react';
import { GoogleLogin } from "react-google-login";


const GoogleLoginButton = ({ clientId, onSuccess, onFailure, text }) => {
  return (
    <GoogleLogin
      theme="dark"
      clientId={clientId}
      buttonText={text}
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
      className="gg-login-button"
    />
  );
};

export default GoogleLoginButton;
