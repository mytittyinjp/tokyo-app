import { useState } from "react";
import { createContainer } from "unstated-next";

const defaultDateTime = new Date("2021-01-01T05:00:00");

const useSlider = (initialState = defaultDateTime) => {
  let [value, setValue] = useState<Date>(initialState);
  let onChange = (newDate: Date) => setValue(newDate);
  return { value, onChange };
};

export const Slider = createContainer(useSlider);
