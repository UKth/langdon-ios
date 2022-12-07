import {
  Class,
  ClassMeetingWithBuilding,
  Course,
  FullSection,
  Table,
} from "@customTypes/models";
import React, { useContext, useState } from "react";
import { Alert, Linking, Pressable, View } from "react-native";
import { BoldText } from "../StyledText";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, colors, messages } from "../../constants";
import styles, { shadow } from "../../constants/styles";
import MyPressable from "../shared/MyPressable";
import { ProgressContext } from "../../contexts/progressContext";
import { deleteClass } from "../../apiFunctions";
import { UserContext } from "../../contexts/userContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { getMeetingTimeString, getNameString, postData } from "../../util";

const CoursePopUpBox = ({
  cls,
  section,
  meeting,
  closePopUp,
  table,
}: {
  cls: Class & {
    sections: FullSection[];
  } & {
    course: Course;
  };
  section: FullSection;
  meeting: ClassMeetingWithBuilding;
  closePopUp: () => void;
  table: Table;
}) => {
  // const theme = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const { spinner } = useContext(ProgressContext);
  const userContext = useContext(UserContext);
  const [showFullPrerequisites, setShowFullPrerequisites] = useState(false);

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
          minHeight: "25%",
          padding: 15,
          ...shadow.hard,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
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
          </View>
          <MyPressable
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={async () => {
              Alert.alert(
                "Course deletion",
                "Do you want to delete the course?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    onPress: async () => {
                      spinner.start();
                      await deleteClass(userContext, {
                        classId: cls.id,
                        tableId: table.id,
                      });
                      closePopUp();
                      spinner.stop();
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash" size={16} color={colors.mediumThemeColor} />
          </MyPressable>
        </View>
        <View
          style={{
            backgroundColor: colors.lightThemeColor,
            height: 1,
            opacity: 0.4,
            marginBottom: 2,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 15,
          }}
        >
          <BoldText
            style={{
              fontSize: 12,
              color: colors.mediumThemeColor,
              opacity: 0.8,
              maxWidth: "80%",
            }}
          >
            {cls.course.title}
          </BoldText>
          <BoldText
            style={{
              fontSize: 11,
              color: colors.mediumThemeColor,
              opacity: 0.8,
            }}
          >
            credit: {cls.course.minimumCredits}
            {cls.course.minimumCredits !== cls.course.maximumCredits
              ? " ~ " + cls.course.maximumCredits
              : ""}
          </BoldText>
        </View>
        <BoldText
          style={{
            fontSize: 12,
            color: colors.mediumThemeColor,
            opacity: 0.8,
            marginBottom: 5,
          }}
        >
          Prerequisites:{" "}
          {cls.course.enrollmentPrerequisites === "None"
            ? cls.course.enrollmentPrerequisites
            : ""}
        </BoldText>
        {cls.course.enrollmentPrerequisites !== "None" ? (
          <MyPressable
            onPress={() => setShowFullPrerequisites(!showFullPrerequisites)}
          >
            <View
              style={{
                flexDirection: "row",
                maxWidth: "95%",
                marginBottom: 10,
              }}
            >
              <BoldText
                style={{
                  fontSize: 11,
                  color: colors.mediumThemeColor,
                  opacity: 0.8,
                }}
                numberOfLines={showFullPrerequisites ? undefined : 1}
              >
                {cls.course.enrollmentPrerequisites}
              </BoldText>
              {!showFullPrerequisites ? (
                <Ionicons
                  name="triangle"
                  size={10}
                  color={colors.mediumThemeColor}
                  style={{
                    opacity: 0.8,
                    marginLeft: 5,
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              ) : null}
            </View>
          </MyPressable>
        ) : null}
        {section.instructor ? (
          <BoldText
            style={{
              fontSize: 11,
              color: colors.mediumThemeColor,
              opacity: 0.9,
              marginBottom: 10,
            }}
          >
            {getNameString({
              firstName: section.instructor.firstName ?? "",
              lastName: section.instructor.lastName ?? "",
              middleName: section.instructor.middleName,
            })}
          </BoldText>
        ) : null}
        {section.classMeetings.map((meeting) => {
          const isExam = meeting.meetingType === "EXAM";

          return (
            <View
              key={meeting.id}
              style={{
                borderWidth: 1,
                borderColor: colors.mediumThemeColor,
                borderRadius: 5,
                marginBottom: 10,
                padding: 5,
              }}
            >
              <BoldText
                style={{
                  fontSize: 11,
                  color: colors.mediumThemeColor,
                  marginBottom: 3,
                }}
              >
                {meeting.meetingType}
                {isExam ? "" : ` - ${section.type} ${section.sectionNumber}`}
              </BoldText>

              <BoldText
                style={{
                  fontSize: 10,
                  color: colors.mediumThemeColor,
                }}
              >
                {meeting.examDate
                  ? new Date(meeting.examDate).toDateString()
                  : meeting.meetingDays}
                {" - "}({getMeetingTimeString(meeting)})
              </BoldText>

              {meeting.building ? (
                <BoldText
                  style={{
                    fontSize: 10,
                    color: colors.mediumThemeColor,
                    marginTop: 3,
                  }}
                >
                  {meeting.building.buildingName}
                </BoldText>
              ) : null}
            </View>
          );
        })}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <MyPressable
            style={{
              paddingHorizontal: 10,
              paddingVertical: 7,
              backgroundColor: "white",
              borderRadius: styles.borderRadius.sm,
              alignItems: "center",
              justifyContent: "center",
              ...shadow.md,
            }}
            hitSlop={{
              top: 10,
              bottom: 10,
              right: 10,
              left: 10,
            }}
            onPress={async () => {
              if (cls.course.boardId) {
                navigation.push("Board", {
                  id: cls.course.boardId,
                  title: cls.course.title,
                });
                closePopUp();
              } else {
                spinner.start();
                const data = await postData(
                  userContext,
                  API_URL + "board/createCourseBoard",
                  { courseId: cls.course.id }
                );
                spinner.stop();

                if (data?.ok && data?.board) {
                  navigation.push("Board", {
                    id: data.board.id,
                    title: data.board.title,
                  });
                  closePopUp();
                } else {
                  Alert.alert(data?.error ?? "Failed to get course board.");
                }
              }
            }}
          >
            <Ionicons name="reader" color={colors.mediumThemeColor} size={20} />
          </MyPressable>
          <MyPressable
            style={{
              backgroundColor: colors.lightThemeColor,
              paddingHorizontal: 5,
              paddingVertical: 3,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "center",
              ...shadow.md,
            }}
            onPress={() => {
              try {
                if (
                  meeting.building &&
                  meeting.building.latitude &&
                  meeting.building.longitude
                ) {
                  Linking.openURL(
                    "comgooglemaps://maps.google.com/?q=@" +
                      meeting.building.latitude +
                      "," +
                      meeting.building.longitude
                  );
                } else {
                  Alert.alert(
                    messages.errorMessages.timeTable
                      .cantOpenGoogleMapsOfBuilding
                  );
                }
              } catch {
                Alert.alert(
                  messages.errorMessages.timeTable.cantOpenGoogleMaps
                );
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
          </MyPressable>
        </View>
      </View>
    </Pressable>
  );
};

export default CoursePopUpBox;
