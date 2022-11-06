import { classWithSections, Course } from "@customTypes/models";
import React, { useState, useEffect, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  debounce,
  getData,
  logJSON,
  nestedSection,
  sectionMapper,
  sum,
} from "../../util";
import { dropClass, getEnrolledClasses } from "../../apiFunctions";
import { UserContext } from "../../contexts/userContext";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { Alert, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/Progress";
import { API_URL, colors, messages } from "../../constants";
import { ScreenContainer, SectionBox } from "../../components";

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

const EnrollClasses = () => {
  const [enrolledClasses, setEnrolledClasses] = useState<
    (classWithSections & { course: Course })[]
  >([]);

  const userContext = useContext(UserContext);

  const [courseKeyword, setCourseKeyword] = useState("");

  const [searchedCourse, setSearchedCourse] =
    useState<(Course & { classes: classWithSections[] })[]>();

  const [selectedCourse, setSelectedCourse] = useState<
    Course & { classes: classWithSections[] }
  >();

  const [mappedSections, setMappedSections] = useState<nestedSection[]>([]);
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    searchCourse(courseKeyword, setSearchedCourse);
  }, [courseKeyword]);

  const updateEnrolledClasses = async () => {
    const data = await getEnrolledClasses(userContext);
    setEnrolledClasses(data);
  };

  useEffect(() => {
    updateEnrolledClasses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const sectionMapperResult = sectionMapper(selectedCourse.classes);
      setMappedSections(sectionMapperResult);
      logJSON(sectionMapperResult);
    }
  }, [selectedCourse]);

  const minCredSum = sum(
    enrolledClasses.map((cls) => cls.course.minimumCredits)
  );
  const maxCredSum = sum(
    enrolledClasses.map((cls) => cls.course.maximumCredits)
  );

  // console.log(searchedCourse);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        style={{
          display: "flex",
          marginBottom: 10,
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: "10%",
            paddingTop: "10%",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: "10%",
            }}
          >
            <BoldText
              style={{
                color: colors.themeColor,
              }}
            >
              Enrolled courses: {enrolledClasses.length}
            </BoldText>
            <BoldText
              style={{
                color: colors.themeColor,
              }}
            >
              credit: {minCredSum}
              {minCredSum !== maxCredSum ? " ~ " + maxCredSum : ""}
            </BoldText>
          </View>
          {enrolledClasses.map((cls) => (
            <View
              key={cls.id}
              style={{
                width: "100%",
                backgroundColor: colors.lightThemeColor,
                marginBottom: 10,
                borderRadius: 15,
                height: 40,
                paddingLeft: 20,
                paddingRight: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <BoldText>{cls.course.courseDesignation}</BoldText>
              <View style={{ flexDirection: "row" }}>
                <BoldText style={{ marginRight: 5 }}>
                  {cls.sections
                    .map((section) => section.type + "" + section.sectionNumber)
                    .join("/")}
                  {"  -  "}
                  {cls.course.minimumCredits}
                  {cls.course.minimumCredits !== cls.course.maximumCredits
                    ? " ~ " + cls.course.maximumCredits
                    : ""}
                </BoldText>
                <Pressable
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10,
                  }}
                  onPress={async () => {
                    spinner.start();
                    await dropClass(userContext, cls.id);
                    Alert.alert(messages.messages.class.dropped);
                    updateEnrolledClasses();

                    spinner.stop();
                  }}
                >
                  <Ionicons name="trash" size={15} color={"white"} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: "5%",
            paddingTop: "10%",
          }}
        >
          <BoldTextInput
            style={{
              width: "100%",
              paddingHorizontal: 20,
              fontSize: 20,
              backgroundColor: colors.lightThemeColor,
              borderRadius: 50,
              height: 50,
              color: "white",
              marginBottom: 10,
            }}
            onChangeText={(text) => {
              setCourseKeyword(text.replace(/ /g, ""));
            }}
            autoCapitalize="none"
            placeholder="ex. COMP SCI 200"
            placeholderTextColor={colors.placeHolerTextColor}
          />
          {searchedCourse ? (
            <View style={{ width: "100%" }}>
              {searchedCourse.map((course) => (
                <View
                  style={{
                    backgroundColor: colors.mediumThemeColor,
                    marginBottom: 5,
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                    paddingTop: 5,
                    borderRadius: 15,
                  }}
                  key={course.id}
                >
                  <Pressable
                    style={({ pressed }) => [
                      {
                        opacity: pressed ? 0.5 : 1,
                      },
                    ]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <BoldText style={{ alignSelf: "flex-end" }}>
                      credit: {course.minimumCredits}
                      {course.minimumCredits !== course.maximumCredits
                        ? " ~ " + course.maximumCredits
                        : ""}
                    </BoldText>
                    <BoldText>{course.title}</BoldText>
                    <BoldText>{course.courseDesignation}</BoldText>
                    <BoldText>{course.fullCourseDesignation}</BoldText>
                  </Pressable>
                  {selectedCourse?.id === course.id ? (
                    <View
                      style={{
                        marginTop: 5,
                        borderTopColor: "white",
                        borderTopWidth: 1,
                        padding: 5,
                      }}
                    >
                      {mappedSections.map((mappedSection) => (
                        <SectionBox
                          key={mappedSection.code}
                          section={mappedSection}
                          onPress={(id: number) => {}}
                          enrolledClasses={enrolledClasses}
                          updateEnrolledClasses={updateEnrolledClasses}
                        />
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default EnrollClasses;
