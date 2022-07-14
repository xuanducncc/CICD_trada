import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
  useCallback
} from "react";

const SteppedLayoutContext = createContext({ current: null, setCurrent: null });

export const SteppedLayoutProvider = ({ children }) => {
  const [current, setCurrent] = useState(0);

  const contextValue = useMemo(
    () => ({
      current,
      setCurrent
    }),
    [current, setCurrent]
  );
  return (
    <SteppedLayoutContext.Provider value={contextValue}>
      {children}
    </SteppedLayoutContext.Provider>
  );
};

export function withSteppedLayoutContext(Component) {
  return function WrapperComponent(props) {
    return (
      <SteppedLayoutProvider>
        <Component {...props} />
      </SteppedLayoutProvider>
    );
  };
}

export const useSteppedLayout = () => useContext(SteppedLayoutContext);

export default useSteppedLayout;
