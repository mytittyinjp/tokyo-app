import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

type Props = {
  dateTime: Date;
  handleChange: (values: number[]) => void;
};

const TimeSlider: React.FC<Props> = (props) => {
  const { dateTime, handleChange } = props;
  const [sliderChanging, setSliderChanging] = React.useState(false);

  const sliderValuesChangeStart = () => setSliderChanging(true);
  const sliderValuesChangeFinish = () => setSliderChanging(false);

  return (
    <View>
      <Text>{dateTime.toString()}</Text>
      <MultiSlider
        values={[dateTime.getTime()]}
        step={600000}
        min={new Date("2021-01-01T05:00:00").getTime()}
        max={new Date("2021-01-02T00:29:00").getTime()}
        onValuesChangeStart={sliderValuesChangeStart}
        onValuesChange={handleChange}
        onValuesChangeFinish={sliderValuesChangeFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default TimeSlider;
