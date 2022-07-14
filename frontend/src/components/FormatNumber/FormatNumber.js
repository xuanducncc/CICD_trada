import Text from "antd/lib/typography/Text";
import React from "react";

const FormatNumber = ({ number, postfix }) => {
  return <Text>{Math.round(number * 100) / 100} {postfix}</Text>;
};

export default FormatNumber;
