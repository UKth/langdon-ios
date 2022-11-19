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
  TIMEBOX_HOUR_HEIGHT,
  WI_GMT_DIFF,
} from "../../constants";
import { dayCharToInt, meetingDayChar, sum } from "../../util";
import { BoldText } from "../StyledText";
import TimeBox from "./TimeBox";

const TimeTableComponent = ({
  table,
  setPopUpBoxData,
}: {
  table?: TableWithClasses;
  setPopUpBoxData: React.Dispatch<
    React.SetStateAction<
      | {
          cls: Class & {
            sections: FullSection[];
          } & {
            course: Course;
          };
          meeting: ClassMeetingWithBuilding;
          section: FullSection;
        }
      | undefined
    >
  >;
}) => {
  let startTime = 9;
  let endTime = 16;
  if (table?.enrolledClasses) {
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

  const minCredSum = sum(
    table?.enrolledClasses.map((cls) => cls.course.minimumCredits) ?? []
  );
  const maxCredSum = sum(
    table?.enrolledClasses.map((cls) => cls.course.maximumCredits) ?? []
  );

  return (
    <View
      style={{
        paddingLeft: 20,
        paddingRight: 10,
        marginBottom: 20,
      }}
    >
      {Array.from({ length: endTime - startTime }, (_, i) => i).map((i) => (
        <BoldText
          key={i}
          style={{
            color: "#808080",
            position: "absolute",
            top: i * TIMEBOX_HOUR_HEIGHT + 25,
            borderTopWidth: 1,
          }}
        >
          {i + startTime}
        </BoldText>
      ))}

      <View style={{ flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ color: colors.lightThemeColor }}>M</BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ color: colors.lightThemeColor }}>T</BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ color: colors.lightThemeColor }}>W</BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ color: colors.lightThemeColor }}>R</BoldText>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <BoldText style={{ color: colors.lightThemeColor }}>F</BoldText>
        </View>
      </View>
      <View
        style={{
          borderWidth: 2,
          borderRadius: 5,
          borderColor: "#a0a0a0",
          width: "100%",
          height: (endTime - startTime) * TIMEBOX_HOUR_HEIGHT, // 9~9
          backgroundColor: "#ffffff",
          marginBottom: 5,
        }}
      >
        {Array.from({ length: endTime - startTime }, (_, i) => i).map((i) => (
          <View
            key={i}
            style={{
              width: "100%",
              height: 1,
              position: "absolute",
              top: TIMEBOX_HOUR_HEIGHT * i,
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
        {table?.enrolledClasses.map((cls, idx) =>
          cls.sections.map((section) =>
            section.classMeetings.map((meeting) =>
              meeting.meetingType !== "EXAM"
                ? meeting.meetingDays?.split("").map((day) => (
                    <TimeBox
                      color={colors.courseBoxColors[idx]}
                      startTime={startTime}
                      key={meeting.id + day}
                      day={dayCharToInt(day as meetingDayChar)}
                      design={cls.course.courseDesignation}
                      meeting={meeting}
                      onPress={() =>
                        setPopUpBoxData({
                          cls,
                          section,
                          meeting,
                        })
                      }
                    />
                  ))
                : null
            )
          )
        )}
        {table && !table.enrolledClasses.length && (
          <BoldText
            style={{
              color: colors.lightThemeColor,
              alignSelf: "center",
              marginTop: 165,
              backgroundColor: "white",
            }}
          >
            There's no enrolled class in the table.
          </BoldText>
        )}
      </View>
      {minCredSum ? (
        <View style={{ paddingHorizontal: 5 }}>
          <BoldText
            style={{
              fontSize: 12,
              color: colors.themeColor,
              opacity: 0.7,
            }}
          >
            credit: {minCredSum}
            {minCredSum !== maxCredSum ? " ~ " + maxCredSum : ""}
          </BoldText>
        </View>
      ) : null}
    </View>
  );
};

export default TimeTableComponent;
