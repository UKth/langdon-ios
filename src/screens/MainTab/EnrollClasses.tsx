import {
  ClassWithSections,
  Course,
  CourseWithClasses,
  TableWithClasses,
  TermCode,
} from "@customTypes/models";
import React, { useState, useEffect, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  debounce,
  nestedSection,
  postData,
  sectionMapper,
  sum,
} from "../../util";
import { deleteClass, getEnrolledClasses, getTable } from "../../apiFunctions";
import { UserContext, userContextType } from "../../contexts/userContext";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { Alert, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/progressContext";
import { API_URL, colors, messages, termNames } from "../../constants";
import {
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
  SectionBox,
  SmallTimeTableComponent,
} from "../../components";
import { shadow } from "../../constants/styles";
import { RouteProp } from "@react-navigation/native";
import { StackGeneratorParamList } from "src/navigation/StackGenerator";

type searchCourseParams = {
  keyword: string;
  setSearchedCourses: React.Dispatch<
    React.SetStateAction<CourseWithClasses[] | undefined>
  >;
  userContext: userContextType;
  termCode: TermCode;
};

const searchCourse: (params: searchCourseParams) => any = debounce(
  async ({
    keyword,
    setSearchedCourses,
    userContext,
    termCode,
  }: searchCourseParams) => {
    if (keyword !== "") {
      const data = await postData(userContext, API_URL + "course/getCourses", {
        keyword,
        termCode,
      });
      if (data?.ok) {
        setSearchedCourses(data.courses);
      }
    }
  },
  400
);

const EnrollClasses = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "EnrollClasses">;
}) => {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (!user) {
    return <ErrorComponent />;
  }

  const tableId = route.params.tableId;

  const [courseKeyword, setCourseKeyword] = useState("");

  const [searchedCourses, setSearchedCourses] = useState<CourseWithClasses[]>();

  const [selectedCourse, setSelectedCourse] = useState<CourseWithClasses>();

  const [mappedSections, setMappedSections] = useState<nestedSection[]>([]);
  const [table, setTable] = useState<TableWithClasses>();
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    if (courseKeyword.length && table?.termCode) {
      searchCourse({
        keyword: courseKeyword,
        setSearchedCourses,
        userContext,
        termCode: table.termCode,
      });
    } else {
      setSearchedCourses(undefined);
    }
  }, [courseKeyword]);

  const updateTable = async () => {
    const data = await getTable(userContext, { tableId });
    if (data) {
      setTable(data);
    } else {
      Alert.alert("Failed to get table data.");
    }
  };

  useEffect(() => {
    updateTable();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const sectionMapperResult = sectionMapper(selectedCourse.classes);
      setMappedSections(sectionMapperResult);
      (async () => {
        const data = await postData(userContext, API_URL + "course/getCourse", {
          courseId: selectedCourse.id,
        });

        if (data?.course?.classes) {
          const sectionMapperResult = sectionMapper(data.course.classes);
          setMappedSections(sectionMapperResult);
        }
      })();
    }
  }, [selectedCourse]);

  const minCredSum = sum(
    table?.enrolledClasses.map((cls) => cls.course.minimumCredits) ?? []
  );
  const maxCredSum = sum(
    table?.enrolledClasses.map((cls) => cls.course.maximumCredits) ?? []
  );

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
            marginBottom: 5,
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
              Enrolled courses: {table?.enrolledClasses.length}
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
          {table?.enrolledClasses.map((cls) => (
            <View
              key={cls.id}
              style={{
                width: "100%",
                backgroundColor: "white",
                marginBottom: 10,
                borderRadius: 15,
                height: 40,
                paddingLeft: 20,
                paddingRight: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

                ...shadow.md,
              }}
            >
              <BoldText style={{ color: colors.mediumThemeColor }}>
                {cls.course.courseDesignation}
              </BoldText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginLeft: 20,
                  flex: 1,
                }}
              >
                <BoldText
                  style={{
                    color: colors.mediumThemeColor,
                    marginRight: 5,
                    fontSize: 12,
                    textAlign: "right",
                  }}
                >
                  {cls.sections
                    .map(
                      (section) => section.type + " " + section.sectionNumber
                    )
                    .join("/")}
                  {" - "}
                  {cls.course.minimumCredits}
                  {cls.course.minimumCredits !== cls.course.maximumCredits
                    ? " ~ " + cls.course.maximumCredits
                    : ""}
                </BoldText>
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
                            updateTable();
                            spinner.stop();
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons
                    name="trash"
                    size={15}
                    color={colors.mediumThemeColor}
                  />
                </MyPressable>
              </View>
            </View>
          ))}
        </View>
        {table ? <SmallTimeTableComponent table={table} /> : null}
        <View style={{ paddingHorizontal: 40, marginBottom: 10 }}>
          <BoldText style={{ color: colors.lightThemeColor }}>
            {table ? termNames[table.termCode] : ""}
          </BoldText>
        </View>
        {table ? (
          <View
            style={{
              alignItems: "center",
              paddingHorizontal: "5%",
            }}
          >
            <BoldTextInput
              style={{
                width: "100%",
                paddingHorizontal: 20,
                fontSize: 20,
                backgroundColor: "white",
                borderRadius: 50,
                height: 50,
                color: colors.mediumThemeColor,
                marginBottom: 20,

                ...shadow.md,
              }}
              onChangeText={(text) => {
                setCourseKeyword(text.trim());
              }}
              autoCapitalize="none"
              placeholder="ex. COMP SCI 200"
              placeholderTextColor={colors.lightThemeColor}
            />
            {courseKeyword.length ? (
              searchedCourses ? (
                searchedCourses.length ? (
                  <View style={{ width: "100%" }}>
                    {searchedCourses.map((course) => (
                      <View
                        style={{
                          backgroundColor: colors.mediumThemeColor,
                          marginBottom: 5,
                          paddingHorizontal: 10,
                          paddingBottom: 12,
                          paddingTop: 12,
                          borderRadius: 15,

                          ...shadow.md,
                        }}
                        key={course.id}
                      >
                        <Pressable
                          style={({ pressed }) => [
                            {
                              opacity: pressed ? 0.5 : 1,
                            },
                          ]}
                          onPress={() => {
                            if (selectedCourse?.id === course.id) {
                              setSelectedCourse(undefined);
                            } else {
                              setSelectedCourse(course);
                            }
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginBottom: 5,
                            }}
                          >
                            <BoldText
                              style={{
                                fontSize: 13,
                                color: "white",
                                maxWidth: "80%",
                              }}
                            >
                              {course.title}
                            </BoldText>
                            <BoldText
                              style={{
                                fontSize: 13,
                                alignSelf: "flex-end",
                                color: "white",
                              }}
                            >
                              credit: {course.minimumCredits}
                              {course.minimumCredits !== course.maximumCredits
                                ? " ~ " + course.maximumCredits
                                : ""}
                            </BoldText>
                          </View>
                          <BoldText style={{ fontSize: 13, color: "white" }}>
                            {course.courseDesignation}
                          </BoldText>
                          <BoldText
                            style={{
                              fontSize: 13,
                              color: "white",
                            }}
                          >
                            {course.fullCourseDesignation}
                          </BoldText>
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
                            <BoldText
                              style={{
                                fontSize: 12,
                                color: "white",
                                marginBottom: 5,
                              }}
                              numberOfLines={
                                selectedCourse?.id === course.id ? undefined : 1
                              }
                            >
                              Prerequisites: {course.enrollmentPrerequisites}
                            </BoldText>
                            {table &&
                              mappedSections.map((mappedSection) => (
                                <SectionBox
                                  key={mappedSection.code}
                                  section={mappedSection}
                                  onPress={(id: number) => {}}
                                  table={table}
                                  updateTable={updateTable}
                                />
                              ))}
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                ) : (
                  <BoldText style={{ color: colors.mediumThemeColor }}>
                    Data not found
                  </BoldText>
                )
              ) : (
                <LoadingComponent />
              )
            ) : null}
          </View>
        ) : null}
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default EnrollClasses;
