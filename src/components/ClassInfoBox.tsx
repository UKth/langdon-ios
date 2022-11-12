import {
  Class,
  ClassWithSections,
  Course,
  FullSection,
} from "@customTypes/models";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  View,
} from "react-native";
import { formatTimeString, getData, nestedSection } from "../util";
import { BoldText } from "./StyledText";
import { dropClass, enrollClass } from "../apiFunctions";
import { UserContext } from "../contexts/userContext";
import { ProgressContext } from "../contexts/progressContext";
import { API_URL, colors, EXAMDATE_OFFSET } from "../constants";
import MyPressable from "./MyPressable";
import { shadow } from "../constants/styles";

const ClassInfoBox = ({
  id,
  enrolledClasses,
  updateEnrolledClasses,
}: {
  id: number;
  enrolledClasses: (Class & {
    sections: FullSection[];
  } & {
    course: Course;
  })[];
  updateEnrolledClasses: () => void;
}) => {
  const [classData, setClassData] = useState<ClassWithSections>();

  const userContext = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    (async () => {
      const data = await getData(API_URL + "course/class/getClass/" + id);
      if (data?.ok) {
        setClassData(data?.classData);
      }
    })();
  }, []);

  if (!classData) {
    return <ActivityIndicator size={"small"} color={"white"} />;
  }

  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",

        ...shadow.md,
      }}
    >
      {classData?.sections.map((section) => (
        <View key={section.id} style={{ marginBottom: 15 }}>
          <BoldText style={{ color: colors.mediumThemeColor }}>
            {section.type} {section.sectionNumber}
          </BoldText>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <BoldText
              style={{ marginBottom: 5, color: colors.mediumThemeColor }}
            >
              meetings
            </BoldText>
            {section.classMeetings.map((meeting) => {
              const isExam = meeting.meetingType === "EXAM";
              const meetingTimeStart = new Date(
                meeting.meetingTimeStart ? meeting.meetingTimeStart : 0
              );
              const meetingTimeEnd = new Date(
                meeting.meetingTimeEnd ? meeting.meetingTimeEnd : 0
              );
              return (
                <View
                  key={meeting.id}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.mediumThemeColor,
                    borderRadius: 5,
                    marginBottom: 5,
                    padding: 5,
                  }}
                >
                  <BoldText style={{ color: colors.mediumThemeColor }}>
                    {meeting.meetingType}
                  </BoldText>
                  {!isExam ? (
                    <BoldText style={{ color: colors.mediumThemeColor }}>
                      {meeting.meetingDays}
                    </BoldText>
                  ) : null}
                  {meeting.examDate ? (
                    <BoldText style={{ color: colors.mediumThemeColor }}>
                      {new Date(
                        meeting.examDate + EXAMDATE_OFFSET || 0
                      ).toDateString()}
                    </BoldText>
                  ) : null}
                  {meetingTimeStart.valueOf() && meetingTimeEnd.valueOf() ? (
                    <BoldText style={{ color: colors.mediumThemeColor }}>
                      {formatTimeString(
                        meetingTimeStart.getHours(),
                        meetingTimeStart.getMinutes()
                      ) +
                        " ~ " +
                        formatTimeString(
                          meetingTimeEnd.getHours(),
                          meetingTimeEnd.getMinutes()
                        )}
                    </BoldText>
                  ) : null}

                  {meeting.building ? (
                    <BoldText style={{ color: colors.mediumThemeColor }}>
                      {meeting.building.buildingName}
                    </BoldText>
                  ) : null}
                </View>
              );
            })}
            {section.instructor ? (
              <View>
                <BoldText style={{ color: colors.mediumThemeColor }}>
                  instructor:
                </BoldText>
                <BoldText style={{ color: colors.mediumThemeColor }}>
                  {section.instructor.firstName +
                    " " +
                    section.instructor.lastName}
                </BoldText>
              </View>
            ) : null}
          </View>
        </View>
      ))}
      <View style={{ alignItems: "center", paddingBottom: 5 }}>
        <MyPressable
          onPress={async () => {
            spinner.start();
            if (enrolledClasses.map((cls) => cls.id).includes(id)) {
              await dropClass(userContext, id);
            } else {
              await enrollClass(userContext, id);
            }
            updateEnrolledClasses();
            spinner.stop();
          }}
          style={{
            backgroundColor: colors.mediumThemeColor,
            padding: 10,
            width: "30%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,

            ...shadow.md,
          }}
        >
          <BoldText style={{ color: "white" }}>
            {enrolledClasses.map((cls) => cls.id).includes(id)
              ? "drop"
              : "enroll"}
          </BoldText>
        </MyPressable>
      </View>
    </View>
  );
};

export default ClassInfoBox;
