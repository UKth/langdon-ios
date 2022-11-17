import { ClassMeetingWithBuilding } from "@customTypes/models";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { shadow } from "../../constants/styles";
import { colors, TIMEBOX_HOUR_HEIGHT, WI_GMT_DIFF } from "../../constants";
import { BoldText } from "../StyledText";
import { MyPressable } from "../shared";

const TimeBox = ({
  style,
  design,
  meeting,
  day,
  onPress,
  isMine = true,
  startTime,
  color = colors.lightThemeColor,
  hourHeightPixel = TIMEBOX_HOUR_HEIGHT,
  fontSize = 13,
}: {
  style?: ViewStyle;
  design: string;
  meeting: ClassMeetingWithBuilding;
  day: number;
  onPress: () => void;
  isMine?: boolean;
  startTime: number;
  color?: string;
  hourHeightPixel?: number;
  fontSize?: number;
}) => {
  if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
    return null;
  }

  const duration = meeting.meetingTimeEnd - meeting.meetingTimeStart;

  const getPixel = (duration: number) => {
    return (hourHeightPixel / (60 * 60 * 1000)) * duration;
  };

  return (
    <MyPressable
      style={{
        ...style,
        width: "20%",
        height: getPixel(duration),
        backgroundColor: color,
        borderRadius: 3,
        padding: hourHeightPixel > 40 ? 3 : 2,
        position: "absolute",
        left: 20 * day + "%",
        top: getPixel(
          (meeting.meetingTimeStart ?? 0) +
            WI_GMT_DIFF -
            startTime * 60 * 60 * 1000
        ),

        ...shadow.md,
      }}
      onPress={isMine ? onPress : () => {}}
    >
      <BoldText style={{ color: "white", fontSize }}>{design}</BoldText>
    </MyPressable>
  );
};

export default TimeBox;
