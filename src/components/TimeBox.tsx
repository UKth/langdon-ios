import { WI_GMT_DIFF } from "../constants/numbers";
import { ClassMeeting } from "@customTypes/models";
import React, { useState, useEffect, useContext } from "react";
import { Text, View, ViewStyle } from "react-native";

const getPixel = (duration: number) => {
  return (600 / (12 * 60 * 60 * 1000)) * duration;
};

export const TimeBox = ({
  style,
  design,
  meeting,
  day,
}: {
  style?: ViewStyle;
  design: string;
  meeting: ClassMeeting;
  day: number;
}) => {
  if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
    return null;
  }

  const duration = meeting.meetingTimeEnd - meeting.meetingTimeStart;

  return (
    <View
      style={{
        ...style,
        width: "20%",
        height: getPixel(duration),
        backgroundColor: "#a0a0a0",
        position: "absolute",
        left: 20 * day + "%",
        top: getPixel(
          meeting.meetingTimeStart + WI_GMT_DIFF - 9 * 60 * 60 * 1000
        ),
      }}
    >
      <Text>{design}</Text>
    </View>
  );
};
