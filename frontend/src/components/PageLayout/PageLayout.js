import { styled } from "@material-ui/styles";
import Result from "antd/lib/result";
import Button from "antd/lib/button";
import Row from "antd/lib/row";
import Loading from "@components/Loading";
import Empty from "antd/lib/empty";
import Text from "antd/lib/typography/Text";
import React from "react";

const PageLayoutWrapper = styled("div")({
  // minHeight: " 280px",
  padding: ({ padding }) => `${padding === undefined ? "24" : padding}px`,
  background: "#fff",
  flex: "1",
  display: "flex",
  height: "100%",
  flexDirection: "column",
});

const PageLayout = ({ children, loading, error, padding, style, isReady, empty, height }) => {
  return (
    <PageLayoutWrapper padding={padding} style={style}>
      {loading && <Loading height={height ? height : "100%"} />}
      {error && (
        <>
          <Result
            status={error.status || "500"}
            title={error.message || "Oops"}
            subTitle={error.description || "Sorry, something went wrong."}
            extra={<Button onClick={() => location.reload()} type="primary">Try Again</Button>}
          />
        </>
      )}
      {empty && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {(typeof isReady === 'boolean' ? isReady : (!error && !loading)) && children}
    </PageLayoutWrapper>
  );
};

const PageLayoutSection = ({ children, title, loading }) => {
  return (
    <div className="layout-section" justify="space-around">
      <div style={{ padding: "0 15px" }}>{title && <h1>{title}</h1>}</div>
      <div>{children}</div>
    </div>
  );
};

PageLayout.Section = PageLayoutSection;

export default PageLayout;
