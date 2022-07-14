import { useLocation } from "react-router-dom";

export function useSearchParams() {
  try {
    const location = useLocation();
    const search = location.search.substring(1);
    if(!search) { return {}; }
    return JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
  } catch (err) {
    console.error(err);
    return {};
  }
}
