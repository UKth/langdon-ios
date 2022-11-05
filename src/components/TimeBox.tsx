import { WI_GMT_DIFF } from "../constants/numbers";
import {
  Building,
  ClassMeeting,
  ClassMeetingWithBuilding,
} from "@customTypes/models";
import React, { useState, useEffect, useContext } from "react";
import { Alert, Linking, Pressable, Text, View, ViewStyle } from "react-native";
import { messages } from "../constants/messages";

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
  meeting: ClassMeetingWithBuilding;
  day: number;
}) => {
  if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
    return null;
  }

  const duration = meeting.meetingTimeEnd - meeting.meetingTimeStart;

  return (
    <Pressable
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
      onPress={() => {
        try {
          if (meeting.building) {
            Linking.openURL(
              "https://maps.google.com/?q=@" +
                meeting.building.latitude +
                "," +
                meeting.building.longitude
            );
          }
        } catch {
          Alert.alert(messages.errorMessages.timeTable.cantOpenGoogleMaps);
        }
      }}
    >
      <Text>{design}</Text>
      {meeting.building ? <Text>{meeting.building.buildingName}</Text> : null}
    </Pressable>
  );
};
