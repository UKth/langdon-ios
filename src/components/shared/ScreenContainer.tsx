import React from "react";
import { View, ViewStyle } from "react-native";

const ScreenContainer = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        ...style,
      }}
    >
      {children}
    </View>
  );
};
export default ScreenContainer;
