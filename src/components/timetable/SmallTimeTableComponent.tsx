import {
  Class,
  ClassMeetingWithBuilding,
  ClassWithSections,
  Course,
  FullSection,
  TableWithClasses,
} from "@customTypes/models";
import React from "react";
import { useState } from "react";
import { View } from "react-native";
import {
  colors,
  HOUR_TS,
  SMALLBOX_HOUR_HEIGHT,
  WI_GMT_DIFF,
} from "../../constants";
import { dayCharToInt, meetingDayChar } from "../../util";
import { BoldText } from "../StyledText";
import TimeBox from "./TimeBox";

const SmallTimeTableComponent = ({ table }: { table?: TableWithClasses }) => {
  let startTime = 12;
  let endTime = 16;
  if (table) {
    for (let i = 0; i < table.enrolledClasses.length; i++) {
      const sections = table.enrolledClasses[i].sections;
      for (let j = 0; j < sections.length; j++) {
        const meetings = sections[j].classMeetings;
        for (let k = 0; k < meetings.length; k++) {
          const meeting = meetings[k];

          if (meeting.meetingType === "CLASS") {
            if (meeting.meetingTimeStart) {
              const startingTimeHour = Math.floor(
                (meeting.meetingTimeStart + WI_GMT_DIFF) / HOUR_TS
              );
              if (startingTimeHour < startTime) {
                startTime = startingTimeHour;
              }
            }
            if (meeting.meetingTimeEnd) {
              const endingTimeHour = Math.ceil(
                (meeting.meetingTimeEnd + WI_GMT_DIFF) / HOUR_TS
              );
              if (endingTimeHour > endTime) {
                endTime = endingTimeHour;
              }
            }
          }
        }
      }
    }
  }

  return (
    <View
      style={{
        paddingLeft: 40,
        paddingRight: 40,
        marginBottom: 30,
      }}
    >
      {Array.from({ length: endTime - startTime }, (_, i) => i).map((i) => (
        <BoldText
          key={i}
          style={{
            color: "#808080",
            position: "absolute",
            left: 20,
            top: i * SMALLBOX_HOUR_HEIGHT + 25,
            borderTopWidth: 1,
            fontSize: 10,
          }}
        >
          {i + startTime}
        </BoldText>
      ))}

      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
            M
          </BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
            T
          </BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
            W
          </BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
            R
          </BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
            F
          </BoldText>
        </View>
      </View>
      <View
        style={{
          borderWidth: 2,
          borderRadius: 5,
          borderColor: "#a0a0a0",
          width: "100%",
          height: (endTime - startTime) * SMALLBOX_HOUR_HEIGHT, // 9~9
          backgroundColor: "#ffffff",
        }}
      >
        {Array.from({ length: endTime - startTime }, (_, i) => i).map((i) => (
          <View
            key={i}
            style={{
              width: "100%",
              height: 1,
              position: "absolute",
              top: SMALLBOX_HOUR_HEIGHT * i,
              backgroundColor: "#e0e0e0",
            }}
          />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              width: 1,
              height: "100%",
              position: "absolute",
              left: 20 * i + "%",
              backgroundColor: "#d0d0d0",
            }}
          />
        ))}
        {table &&
          table.enrolledClasses.map((cls, idx) =>
            cls.sections.map((section) =>
              section.classMeetings.map((meeting) =>
                meeting.meetingType !== "EXAM"
                  ? meeting.meetingDays
                      ?.split("")
                      .map((day) => (
                        <TimeBox
                          color={colors.courseBoxColors[idx]}
                          startTime={startTime}
                          key={meeting.id + day}
                          day={dayCharToInt(day as meetingDayChar)}
                          design={cls.course.courseDesignation}
                          meeting={meeting}
                          onPress={() => {}}
                          hourHeightPixel={SMALLBOX_HOUR_HEIGHT}
                          fontSize={8}
                        />
                      ))
                  : null
              )
            )
          )}
      </View>
    </View>
  );
};

export default SmallTimeTableComponent;
