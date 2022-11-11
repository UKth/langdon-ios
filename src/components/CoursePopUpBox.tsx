import {
  Class,
  ClassMeeting,
  ClassMeetingWithBuilding,
  Course,
  fullSection,
} from "@customTypes/models";
import React from "react";
import { Alert, Linking, Pressable, View } from "react-native";
import { BoldText } from "./StyledText";
import { Ionicons } from "@expo/vector-icons";
import { colors, messages } from "../constants";
import { shadow } from "../constants/styles";

const CoursePopUpBox = ({
  cls,
  meeting,
  closePopUp,
}: {
  cls: Class & {
    sections: fullSection[];
  } & {
    course: Course;
  };
  meeting: ClassMeetingWithBuilding;
  closePopUp: () => void;
}) => {
  // const theme = useContext(ThemeContext);
  return (
    <Pressable
      style={{
        position: "absolute",
        zIndex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={closePopUp}
    >
      <View
        style={{
          backgroundColor: "black",
          opacity: 0.3,
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      />
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          width: "70%",
          height: "25%",
          padding: 15,
          ...shadow.hard,
        }}
      >
        <BoldText style={{ color: colors.mediumThemeColor, opacity: 0.8 }}>
          {cls.course.fullCourseDesignation}
        </BoldText>
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 2,
          }}
        >
          {cls.course.courseDesignation}
        </BoldText>
        <View
          style={{
            backgroundColor: colors.lightThemeColor,
            height: 1,
            opacity: 0.4,
            marginBottom: 2,
          }}
        />
        <BoldText
          style={{
            fontSize: 12,
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 2,
          }}
        >
          {cls.course.title}
        </BoldText>
        <BoldText
          style={{
            fontSize: 11,
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 10,
          }}
        >
          credit: {cls.course.minimumCredits}
          {cls.course.minimumCredits !== cls.course.maximumCredits
            ? " ~ " + cls.course.maximumCredits
            : ""}
        </BoldText>
        <BoldText
          style={{ fontSize: 12, color: colors.mediumThemeColor, opacity: 0.8 }}
        >
          {cls.sections.map(
            (sec) =>
              (sec.instructor.firstName ?? "") + " " + sec.instructor.lastName
          )}
        </BoldText>
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.5 : 1,
            },
            {
              backgroundColor: colors.lightThemeColor,
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              position: "absolute",
              right: 10,
              bottom: 10,
              flexDirection: "row",
              alignItems: "center",
              ...shadow.md,
            },
          ]}
          onPress={() => {
            try {
              if (
                meeting.building &&
                meeting.building.latitude &&
                meeting.building.longitude
              ) {
                Linking.openURL(
                  "https://maps.google.com/?q=@" +
                    meeting.building.latitude +
                    "," +
                    meeting.building.longitude
                );
              } else {
                Alert.alert(
                  messages.errorMessages.timeTable.cantOpenGoogleMapsOfBuilding
                );
              }
            } catch {
              Alert.alert(messages.errorMessages.timeTable.cantOpenGoogleMaps);
            }
          }}
        >
          <View style={{ marginRight: 10 }}>
            <BoldText style={{ color: "white", fontSize: 12 }}>
              {meeting.building.buildingName}
            </BoldText>
            <BoldText style={{ color: "white", fontSize: 12 }}>
              {meeting.building.streetAddress}
            </BoldText>
          </View>
          <Ionicons name="location" color={"white"} size={20} />
        </Pressable>
      </View>
    </Pressable>
  );
};

export default CoursePopUpBox;
