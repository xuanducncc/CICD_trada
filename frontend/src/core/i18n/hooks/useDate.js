import { useMemo } from "react";
import format from "date-fns/format";
import formatDistance from "date-fns/formatDistance";

function useDate(date, { relative = false } = { relative: false }) {
  const value = useMemo(() => {
    try {
      if (relative) {
        return formatDistance(new Date(date), new Date(), {
          addSuffix: true,
        });
      }
      return format(new Date(date), "dd/MM/yyyy hh:mm");
    } catch (e) {
      console.error(e);
      return 'Invalid date';
    }
  }, [date, relative]);
  return value;
}

export default useDate;
