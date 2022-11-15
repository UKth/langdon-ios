import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, ViewProps } from "react-native";
import { colors, styles } from "../../constants";
const ProfileIcon = (
  props: ViewProps & {
    size: number;
  }
) => (
  <View
    style={[
      {
        backgroundColor: colors.lightThemeColor,
        width: props.size,
        height: props.size,
        borderRadius: styles.borderRadius.sm,
        alignItems: "center",
        justifyContent: "center",
      },
      props.style,
    ]}
  >
    <Ionicons name="person" size={props.size * 0.7} color={"white"} />
  </View>
);

export default ProfileIcon;
