import { styled } from "@material-ui/styles";
import Text from "antd/lib/typography/Text";
import React from "react";
import useProtected from "./ProtectedContext";
import Loading from "@components/Loading";
import Button from "antd/lib/button";
import Result from "antd/lib/result";

const ProtectedLayoutWrapper = styled("div")({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flex: 1,
});

const ProtectedLayoutHeader = styled("div")({});

const ProtectedLayoutError = styled("div")({
  height: "100%",
  flex: "1",
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
});

const ProtectedLayoutContent = styled("div")({
  flex: "1",
  display: "flex",
  flexDirection: "column",
});

const ProtectedLayout = ({ children, header }) => {
  const { showHeader, user, loading, error, logout } = useProtected();
  return (
    <ProtectedLayoutWrapper>
      {user && showHeader && (
        <ProtectedLayoutHeader>{header}</ProtectedLayoutHeader>
      )}
      <ProtectedLayoutContent>
        {user && children}
        {loading === "pending" && <Loading height={"100vh"} />}
        {error && (
          <ProtectedLayoutError>
            <Result
              status={error.status || "500"}
              title={error.message || "Oops"}
              subTitle={error.description || "Sorry, something went wrong."}
              extra={
                <Button onClick={logout} type="primary">
                  Back To Login
                </Button>
              }
            />
          </ProtectedLayoutError>
        )}
      </ProtectedLayoutContent>
    </ProtectedLayoutWrapper>
  );
};

export default ProtectedLayout;
