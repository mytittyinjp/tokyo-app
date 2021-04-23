import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { format } from "date-fns";

type Props = {
  dateTime: Date;
  handleChange: (newDate: Date) => void;
};

const TimeSlider: React.FC<Props> = (props) => {
  const { dateTime, handleChange } = props;
  const [sliderChanging, setSliderChanging] = React.useState(false);

  const sliderValuesChangeStart = () => setSliderChanging(true);
  const sliderValuesChangeFinish = () => setSliderChanging(false);

  const sliderValuesChange = (values: number[]) => {
    const newDate = new Date(values[0]);
    handleChange(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateTime}>
        <Text style={styles.text}>{format(dateTime, "yyyy-MM-dd H:mm")}</Text>
      </View>
      <View style={styles.multiSlider}>
        <MultiSlider
          values={[dateTime.getTime()]}
          step={600000}
          min={new Date("2021-01-01T05:00:00").getTime()}
          max={new Date("2021-01-02T00:29:00").getTime()}
          onValuesChangeStart={sliderValuesChangeStart}
          onValuesChange={sliderValuesChange}
          onValuesChangeFinish={sliderValuesChangeFinish}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTime: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0378C4",
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    width: "60%",
  },
  text: {
    fontSize: 18,
    color: "#FFF",
  },
  multiSlider: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0378C4",
    borderRadius: 5,
    width: "100%",
  },
});

export default TimeSlider;
