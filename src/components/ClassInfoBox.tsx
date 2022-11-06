import {
  Class,
  classWithSections,
  Course,
  fullSection,
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
import { ProgressContext } from "../contexts/Progress";
import { API_URL, colors, EXAMDATE_OFFSET } from "../constants";

const ClassInfoBox = ({
  id,
  enrolledClasses,
  updateEnrolledClasses,
}: {
  id: number;
  enrolledClasses: (Class & {
    sections: fullSection[];
  } & {
    course: Course;
  })[];
  updateEnrolledClasses: () => void;
}) => {
  const [classData, setClassData] = useState<classWithSections>();

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
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "white",
      }}
    >
      {classData?.sections.map((section) => (
        <View key={section.id} style={{ marginBottom: 15 }}>
          <BoldText>
            {section.type} {section.sectionNumber}
          </BoldText>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <BoldText style={{ marginBottom: 5 }}>meetings</BoldText>
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
                    borderColor: "white",
                    borderRadius: 5,
                    marginBottom: 5,
                    padding: 5,
                  }}
                >
                  <BoldText>{meeting.meetingType}</BoldText>
                  {!isExam ? <BoldText>{meeting.meetingDays}</BoldText> : null}
                  {meeting.examDate ? (
                    <BoldText>
                      {new Date(
                        meeting.examDate + EXAMDATE_OFFSET || 0
                      ).toDateString()}
                    </BoldText>
                  ) : null}
                  {meetingTimeStart.valueOf() && meetingTimeEnd.valueOf() ? (
                    <BoldText>
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
                    <BoldText>{meeting.building.buildingName}</BoldText>
                  ) : null}
                </View>
              );
            })}
            {section.instructor ? (
              <View>
                <BoldText>instructor:</BoldText>
                <BoldText>
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
        <Pressable
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
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
            {
              backgroundColor: "white",
              padding: 10,
              width: "30%",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
            },
          ]}
        >
          <BoldText style={{ color: colors.themeColor }}>
            {enrolledClasses.map((cls) => cls.id).includes(id)
              ? "drop"
              : "enroll"}
          </BoldText>
        </Pressable>
      </View>
    </View>
  );
};

export default ClassInfoBox;
