import {
  Class,
  ClassMeetingWithBuilding,
  classWithSections,
  Course,
  fullSection,
} from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  dayCharToInt,
  debounce,
  getData,
  logout,
  meetingDayChar,
} from "../../util";
import { UserContext } from "../../contexts/userContext";
import { dropClass, enrollClass, getEnrolledClasses } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_URL, colors, EXAMDATE_OFFSET } from "../../constants";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/Progress";
import {
  CoursePopUpBox,
  MyPressable,
  ScreenContainer,
  TimeBox,
  TimeTableComponent,
} from "../../components";

const searchCourse = debounce(
  async (
    keyword: string,
    setSearchedCourse: React.Dispatch<
      React.SetStateAction<Course[] | undefined>
    >
  ) => {
    if (keyword !== "") {
      const data = await getData(API_URL + "course/getCourse/" + keyword);
      if (data?.ok) {
        setSearchedCourse(data.courseData);
      }
    }
  },
  400
);

const TimeTable = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "TimeTable">;
}) => {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  const [searchedCourse, setSearchedCourse] =
    useState<(Course & { classes: classWithSections[] })[]>();
  const [courseKeyword, setCourseKeyword] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<
    Course & { classes: classWithSections[] }
  >();
  const [selectedClass, setSelectedClass] = useState<classWithSections>();
  const [enrolledClasses, setEnrolledClasses] = useState<
    (classWithSections & { course: Course })[]
  >([]);
  const [classData, setClassData] = useState<classWithSections>();
  const [popUpBoxData, setPopUpBoxData] = useState<{
    cls: Class & {
      sections: fullSection[];
    } & {
      course: Course;
    };
    meeting: ClassMeetingWithBuilding;
  }>();

  const { spinner } = useContext(ProgressContext);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const updateEnrolledClasses = async () => {
    const data = await getEnrolledClasses(userContext);
    setEnrolledClasses(data);
  };

  useEffect(() => {
    (async () => {
      spinner.start();
      await updateEnrolledClasses();
      spinner.stop();
    })();
    navigation.addListener("focus", updateEnrolledClasses);
    return () => navigation.removeListener("focus", updateEnrolledClasses);
  }, []);

  useEffect(() => {
    searchCourse(courseKeyword, setSearchedCourse);
  }, [courseKeyword]);

  useEffect(() => {
    (async () => {
      if (selectedClass) {
        const data = await getData(
          API_URL + "course/class/getClass/" + selectedClass.id
        );
        if (data?.ok) {
          setClassData(data?.classData);
        }
      }
    })();
  }, [selectedClass]);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <BoldText style={{ color: colors.mediumThemeColor }}>
            logged in as {user?.firstName} {user?.lastName}
          </BoldText>
          <MyPressable
            style={{
              borderRadius: 30,
              padding: 15,
              alignItems: "center",
              justifyContent: "center",

              backgroundColor: "white",
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              shadowColor: `rgba(0,0,0,0.1)`,
              shadowOpacity: 1,
            }}
            onPress={() => navigation.push("EnrollClasses")}
          >
            <View
              style={{
                position: "absolute",
                width: 15,
                height: 2,
                borderRadius: 2,
                backgroundColor: colors.themeColor,
              }}
            />
            <View
              style={{
                position: "absolute",
                width: 2,
                height: 15,
                borderRadius: 2,
                backgroundColor: colors.mediumThemeColor,
              }}
            />
          </MyPressable>
        </View>
        <TimeTableComponent
          enrolledClasses={enrolledClasses}
          setPopUpBoxData={setPopUpBoxData}
        />
        <MyPressable
          style={{
            marginTop: 30,
            padding: 10,
            borderRadius: 20,
            backgroundColor: colors.lightThemeColor,
            width: "30%",
            alignSelf: "center",
            alignItems: "center",
            marginBottom: 30,

            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            shadowColor: `rgba(0,0,0,0.1)`,
            shadowOpacity: 1,
          }}
          onPress={() => logout(userContext)}
        >
          <BoldText>logout</BoldText>
        </MyPressable>
      </KeyboardAwareScrollView>
      {popUpBoxData ? (
        <CoursePopUpBox
          cls={popUpBoxData.cls}
          meeting={popUpBoxData.meeting}
          closePopUp={() => setPopUpBoxData(undefined)}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default TimeTable;
