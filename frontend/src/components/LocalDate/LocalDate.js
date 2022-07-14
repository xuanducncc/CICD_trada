import useDate from "@core/i18n/hooks/useDate";
import Text from "antd/lib/typography/Text";

import React from "react";

const LocalDate = ({ date, relative }) => {
  const value = useDate(date, { relative });
  return <Text>{value}</Text>;
};

export default LocalDate;
