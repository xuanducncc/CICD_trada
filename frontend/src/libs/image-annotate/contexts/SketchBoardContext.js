import React, { useContext, useMemo } from "react";

const SketchBoardContext = React.createContext(null);

export const SketchBoardProvider = ({ value, children }) => {

  const contextValue = useMemo(
    () => ({
      ...value,
    }),
    [value]
  );

  return (
    <SketchBoardContext.Provider value={contextValue}>
      {children}
    </SketchBoardContext.Provider>
  );
};

const useSketchBoard = () => useContext(SketchBoardContext);

export default useSketchBoard;
