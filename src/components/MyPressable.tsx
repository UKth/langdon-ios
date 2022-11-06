import React from "react";

import { Pressable, PressableProps } from "react-native";
import { ViewStyle } from "react-native";

const MyPressable = (
  props: PressableProps & {
    style: ViewStyle;
  }
) => {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        props.style,
      ]}
    />
  );
};

export default MyPressable;
