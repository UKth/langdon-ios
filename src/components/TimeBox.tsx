import { ClassMeetingWithBuilding } from "@customTypes/models";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { shadow } from "../constants/styles";
import { colors, WI_GMT_DIFF } from "../constants";
import { BoldText } from "./StyledText";

const getPixel = (duration: number) => {
  return (600 / (12 * 60 * 60 * 1000)) * duration;
};

const TimeBox = ({
  style,
  design,
  meeting,
  day,
  onPress,
}: {
  style?: ViewStyle;
  design: string;
  meeting: ClassMeetingWithBuilding;
  day: number;
  onPress: () => void;
}) => {
  if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
    return null;
  }

  const duration = meeting.meetingTimeEnd - meeting.meetingTimeStart;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        {
          ...style,
          width: "20%",
          height: getPixel(duration),
          backgroundColor: colors.lightThemeColor,
          borderRadius: 3,
          padding: 3,
          position: "absolute",
          left: 20 * day + "%",
          top: getPixel(
            (meeting.meetingTimeStart ?? 0) + WI_GMT_DIFF - 9 * 60 * 60 * 1000
          ),

          ...shadow.md,
        },
      ]}
      onPress={onPress}
    >
      <BoldText style={{ fontSize: 13 }}>{design}</BoldText>
    </Pressable>
  );
};

export default TimeBox;
