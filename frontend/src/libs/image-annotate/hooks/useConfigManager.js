import { useState, useMemo, useCallback } from "react";

export default function useConfigManager(rawConfig) {

  const config = useMemo(() => {
   return {
     ...rawConfig
   }
 }, [rawConfig]);

  return {
    config,
  };
}
