import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as d3 from "d3";
import GeoJSON from "geojson";

import { sensorLatLon } from "../constants";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmFuZGVtbyIsImEiOiJja2R5Z21qZ2swMjRtMnlueWo1cm9zbGl0In0.pQdWOAinK4tNCUCr7U4oKQ";

const DATA =
  "https://www.geospatial.jp/ckan/dataset/9796489e-0a34-4d84-8c46-eb576daa1ded/resource/d51df612-7f5d-44e1-ac86-bfe2c57596bc/download/20210101.csv";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
  const [geojson, setGeojson] = useState<GeoJSON.GeoJSON>();

  useEffect(() => {
    d3.text(DATA)
      .then((text: string) => {
        const data = d3.csvParseRows(text).map((row) => {
          return {
            latitude: sensorLatLon[Number(row[0]) - 1].latitude,
            longitude: sensorLatLon[Number(row[0]) - 1].longitude,
            datetime: new Date(`${row[1]}T${row[2]}:00`),
            in: Number(row[3]),
            out: Number(row[4]),
            inSum: Number(row[5]),
            outSum: Number(row[6]),
          };
        });
        const geojson = GeoJSON.parse(data, {
          Point: ["latitude", "longitude"],
          include: ["datetime", "in", "out"],
        });
        setGeojson(geojson);
      })
      .catch((error: string) => {
        console.log("error", error);
      });
  });

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
        >
          {geojson ? (
            <MapboxGL.ShapeSource id="exampleShapeSource" shape={geojson}>
              <MapboxGL.CircleLayer
                id="singlePoint"
                filter={["==", "datetime", "2021-01-01T06:06:00.000Z"]}
              />
            </MapboxGL.ShapeSource>
          ) : (
            <View></View>
          )}
          <MapboxGL.Camera
            centerCoordinate={[133.0637379, 35.4639893]}
            zoomLevel={17}
          />
        </MapboxGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
});

export default Map;
