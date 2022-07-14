import React, { useCallback, useEffect, useMemo } from "react";
import Steps from "antd/lib/steps";
import Button from "antd/lib/button";
import Layout from "antd/lib/layout";
import {
  withSteppedLayoutContext,
  useSteppedLayout
} from "./SteppedLayoutContext";

import "./SteppedLayout.css";

const SteppedLayout = ({ children, current, onChange, onBack, onNext }) => {
  const { setCurrent: setCtxCurrent } = useSteppedLayout();

  const steps = useMemo(() => {
    return React.Children.map(children, child => ({
      step: child.props.step,
      title: child.props.title,
      header: child.props.title,
      description: child.description
    }));
  }, [children]);

  const currentStep = useMemo(() => {
    return steps.find(step => {
      return step.step === current;
    });
  }, [steps, current]);

  const handleOnChange = useCallback(
    event => {
      if (typeof onChange === "function") {
        onChange(event);
      }
    },
    [onChange]
  );

  const handleNext = useCallback(
    event => {
      if (typeof onNext === "function") {
        onNext(event);
      }
    },
    [onNext]
  );

  const handleBack = useCallback(
    event => {
      if (typeof onBack === "function") {
        onBack(event);
      }
    },
    [onBack]
  );

  useEffect(() => {
    setCtxCurrent(current);
  }, [current]);

  return (
    <Layout>
      <Layout.Sider theme="light">
        <Steps direction="vertical" current={current}>
          {steps.map(step => (
            <Steps.Step
              key={step.key}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </Steps>
      </Layout.Sider>
      <Layout theme="light" style={{ backgroundColor: "white" }}>
        <Layout.Header className="stepped-layout-header">
          <div className="stepped-layout-header-title">
            {currentStep ? currentStep.header : ""}
          </div>
          <div className="stepped-layout-header-extra">
            <Button onClick={handleBack} type="default">
              Back
            </Button>
            {currentStep?.step < 6 ? (
              <Button onClick={handleNext} type="primary">
                Next
              </Button>
            ) : (
              <></>
            )}
          </div>
        </Layout.Header>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

const SteppedLayoutStep = ({ children, title, step }) => {
  const { current } = useSteppedLayout();
  if (current !== step) {
    return <></>;
  }
  return <>{children}</>;
};


const SteppedLayoutWithContext = withSteppedLayoutContext(SteppedLayout);

SteppedLayoutWithContext.Step = SteppedLayoutStep;

export default SteppedLayoutWithContext;
