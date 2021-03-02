import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import * as d3 from "d3";
import GeoJSON from "geojson";
import { point, featureCollection } from "@turf/turf";

import TimeSlider from "../components/TimeSlider";
import { sensorLatLon } from "../constants";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmFuZGVtbyIsImEiOiJja2R5Z21qZ2swMjRtMnlueWo1cm9zbGl0In0.pQdWOAinK4tNCUCr7U4oKQ";
const DATA =
  "https://www.geospatial.jp/ckan/dataset/9796489e-0a34-4d84-8c46-eb576daa1ded/resource/d51df612-7f5d-44e1-ac86-bfe2c57596bc/download/20210101.csv";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
  const [geojson, setGeojson] = useState<GeoJSON.Feature[]>();
  const [
    filteredGeojson,
    setFilteredGeojson,
  ] = useState<GeoJSON.FeatureCollection>();
  const [sliderValue, setSliderValue] = React.useState(
    new Date("2021-01-01T05:00:00")
  );

  useEffect(() => {
    d3.text(DATA)
      .then((text: string) => {
        const features = d3.csvParseRows(text).map((row) => {
          return point(
            [
              sensorLatLon[Number(row[0]) - 1].longitude,
              sensorLatLon[Number(row[0]) - 1].latitude,
            ],
            {
              dateTime: new Date(`${row[1]}T${row[2]}:00`),
              in: Number(row[3]),
              out: Number(row[4]),
              inSum: Number(row[5]),
              outSum: Number(row[6]),
            }
          );
        });
        const newFeatures = filterFeatures(features, sliderValue);
        setGeojson(features);
        setFilteredGeojson(featureCollection(newFeatures));
      })
      .catch((error: string) => {
        console.log("error", error);
      });
  }, []);

  const sliderValuesChange = (values: number[]) => {
    setSliderValue(new Date(values[0]));
    const newFeatures = filterFeatures(geojson!, sliderValue);
    setFilteredGeojson(featureCollection(newFeatures));
  };

  const filterFeatures = (features: GeoJSON.Feature[], dateTime: Date) => {
    const newFeatures = features!.filter((feature) => {
      if (feature.properties!.dateTime.getTime() === dateTime.getTime()) {
        return true;
      }
    });
    return newFeatures;
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
        >
          {filteredGeojson ? (
            <MapboxGL.Animated.ShapeSource
              id="exampleShapeSource"
              shape={filteredGeojson}
            >
              <MapboxGL.Animated.CircleLayer
                id="singlePoint"
                style={{
                  circleColor: [
                    "case",
                    [">", ["get", "inSum"], 2000],
                    "#bd0026",
                    [">", ["get", "inSum"], 1000],
                    "#f03b20",
                    [">", ["get", "inSum"], 500],
                    "#fd8d3c",
                    [">", ["get", "inSum"], 100],
                    "#fecc5c",
                    "#ffffb2",
                  ],
                  circleStrokeWidth: 2,
                  circleStrokeColor: "#c9c9c9",
                }}
              />
            </MapboxGL.Animated.ShapeSource>
          ) : (
            <View></View>
          )}
          <MapboxGL.Camera
            centerCoordinate={[133.0637379, 35.4639893]}
            zoomLevel={17}
          />
        </MapboxGL.MapView>
      </View>
      <View style={styles.slider}>
        <TimeSlider dateTime={sliderValue} handleChange={sliderValuesChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "80%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
  slider: {
    position: "absolute",
    bottom: 10,
    height: "20%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Map;
