import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { defaultHotkeys } from "./default-hotkeys";
import { useAppConfig } from "../AppConfig";
import { HotKeys } from "react-hotkeys";

export const HotkeyContext = createContext({
  hotkeys: defaultHotkeys,
  keyMap: {},
  unregisterHotkey: null,
  registerHotkey: null,
});

export const useHotkeyStorage = () => useContext(HotkeyContext);

export const HotkeyStorageProvider = ({ children }) => {
  const [hotkeys, setHotkeys] = useState(defaultHotkeys);

  const keyMap = useMemo(() => {
    const keyMap = {};
    for (const { id, binding } in hotkeys) {
      if (!binding) continue;
      keyMap[id] = binding;
    }
    return keyMap;
  }, [hotkeys]);

  const handlers = useMemo(() => {
    const keyMap = {};
    for (const { id, handle } in hotkeys) {
      if (!handle) continue;
      keyMap[id] = handle;
    }
    return keyMap;
  }, [hotkeys, setHotkeys]);

  const registerHotkey = useCallback(
    (def) => {
      setHotkeys({
        ...hotkeys,
        [def.id]: def,
      });
    },
    [hotkeys, setHotkeys]
  );

  const unregisterHotkey = useCallback(
    (id) => {
      delete hotkeys[id];
      setHotkeys({ ...hotkeys });
    },
    [hotkeys]
  );

  const contextValue = useMemo(
    () => ({
      hotkeys,
      keyMap,
      unregisterHotkey,
      registerHotkey,
    }),
    [hotkeys, keyMap, unregisterHotkey, registerHotkey]
  );

  return (
    <HotkeyContext.Provider value={contextValue}>
      <HotKeys
        style={{
          height: "100%",
        }}
        keyMap={keyMap}
        handlers={handlers}
      >
        {children}
      </HotKeys>
    </HotkeyContext.Provider>
  );
};

export { defaultHotkeys };
