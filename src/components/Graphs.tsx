import React, { useState, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  VictoryArea,
  VictoryChart,
  VictoryGroup,
  VictoryStack,
  VictoryLegend,
  VictoryAxis,
} from "victory-native";
import * as d3 from "d3";
import { format, isValid } from "date-fns";

const DATA =
  "https://www.geospatial.jp/ckan/dataset/9796489e-0a34-4d84-8c46-eb576daa1ded/resource/d51df612-7f5d-44e1-ac86-bfe2c57596bc/download/20210101.csv";

type Props = { id: number };

const Graphs: React.FC<Props> = (props) => {
  const { id } = props;
  const [graphOriginData, setGraphOriginData] = useState<any>([]);
  const [graphData, setGraphData] = useState<any>([]);

  useEffect(() => {
    d3.text(DATA)
      .then((text: string) => {
        const data = d3.csvParseRows(text).map((row) => {
          let dateTime = new Date(`${row[1]}T${row[2]}:00`);
          if (!isValid(dateTime)) {
            const date = row[1].split("-");
            const time = row[2].split(":");
            dateTime = new Date(
              Number(date[0]),
              Number(date[1]) - 1,
              Number(date[2]),
              Number(time[0]),
              Number(time[1])
            );
          }
          return {
            id: Number(row[0]),
            dateTime: dateTime,
            in: Number(row[3]),
            out: Number(row[4]),
            inSum: Number(row[5]),
            outSum: Number(row[6]),
            total: Number(row[5]) + Number(row[6]),
          };
        });
        setGraphOriginData(data);
      })
      .catch((error: string) => {
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    const inSum = getBarData("inSum", id);
    const outSum = getBarData("outSum", id);
    setGraphData({ inSum: inSum, outSum: outSum });
  }, [id, graphOriginData]);

  const getBarData = (type: string, id: number): object[] => {
    return graphOriginData
      .filter((d: any) => id === d.id)
      .map((d: any) => {
        let y = 0;
        switch (type) {
          case "in":
            y = d.in;
            break;
          case "inSum":
            y = d.inSum;
            break;
          case "out":
            y = d.out;
            break;
          case "outSum":
            y = d.outSum;
            break;
        }
        return { x: d.dateTime, y: y, outSum: d.outSum };
      });
  };

  return (
    <View style={styles.container}>
      <VictoryChart domainPadding={{ x: 10 }} width={400} height={250}>
        <VictoryLegend
          x={125}
          y={10}
          orientation="horizontal"
          gutter={20}
          colorScale={["cyan", "magenta"]}
          data={[{ name: "InSum" }, { name: "OutSum" }]}
        />
        <VictoryGroup offset={20} style={{ data: { width: 2 } }}>
          <VictoryStack
            style={{
              data: { strokeWidth: 3, fillOpacity: 0.4 },
            }}
          >
            <VictoryArea
              style={{
                data: { fill: "cyan", stroke: "cyan" },
              }}
              data={graphData.inSum}
            />
            <VictoryArea
              style={{
                data: { fill: "magenta", stroke: "magenta" },
              }}
              data={graphData.outSum}
            />
            <VictoryAxis dependentAxis />
            <VictoryAxis tickFormat={(d: any) => format(d, "H:m")} />
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Graphs;
