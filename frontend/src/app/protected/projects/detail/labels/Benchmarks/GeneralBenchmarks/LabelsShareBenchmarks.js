import { IMAGE_ANNOTATION_TYPE } from "@utils/const";
import Table from "antd/lib/table";
import Text from "antd/lib/typography/Text";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import React, { useMemo, useState } from "react";
import DropdownMenu from "../../../overview/DropdownMenu";
import useProjectDetailBenchmarks from "../BenchmarksContext";
import FormatNumber from "@components/FormatNumber/FormatNumber";

const LABEL_COUNT_TYPES = [
  {
    label: "Object Count",
    value: IMAGE_ANNOTATION_TYPE.DETECTION,
  },
  {
    label: "Classification Count",
    value: IMAGE_ANNOTATION_TYPE.CLASSIFICATION,
  },
];

const LabelsShareBenchmarks = () => {
  const { overview } = useProjectDetailBenchmarks();
  const [toolType, setToolType] = useState(IMAGE_ANNOTATION_TYPE.DETECTION);
  const objects = useMemo(() => {
    return overview?.objects
      ? overview.objects.filter((ob) => ob.tool_type === toolType)
      : [];
  }, [overview, toolType]);

  const columns = useMemo(() => {
    const total = objects.reduce((acc, cur) => {
      return acc + cur.count;
    }, 0);
    return [
      {
        title: "Object",
        key: "object",
        dataIndex: "object",
      },
      {
        title: "Count",
        key: "count",
        dataIndex: "count",
      },
      {
        title: "Shares",
        key: "count",
        dataIndex: "count",
        // eslint-disable-next-line react/display-name
        render: (d) => {
          return <FormatNumber number={(d / total) * 100}  postfix={'%'} />;
        },
      },
    ];
  }, [objects]);

  return (
    <Row>
      <Col flex={2} className="layout-content-overview">
        <>
          <DropdownMenu
            defaultValue={IMAGE_ANNOTATION_TYPE.DETECTION}
            onChange={setToolType}
            data={LABEL_COUNT_TYPES}
            mapDataFromKey={() => {}}
          />
        </>
        <Table
          dataSource={objects}
          columns={columns}
          size="small"
          pagination={false}
        ></Table>
      </Col>
    </Row>
  );
};

export default LabelsShareBenchmarks;
