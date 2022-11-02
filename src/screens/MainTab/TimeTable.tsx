import {
  Building,
  Class,
  ClassMeeting,
  Course,
  Instructor,
  Section,
} from "@customTypes/models";
import { TimeBox } from "../../components/TimeBox";
import { RouteProp } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/urls";
import { dayCharToInt, debounce, getData, meetingDayChar } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { MainTabParamList } from "../../navigation/MainTab";
import { EXAMDATE_OFFSET } from "../../constants/numbers";
import { dropClass, enrollClass, getEnrolledClasses } from "../../apiFunctions";

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

type fullSection = Section & {
  instructor: Instructor;
  classMeetings: (ClassMeeting & {
    building: Building;
  })[];
};

type classWithSections = Class & { sections: fullSection[] };

const TimeTable = ({
  route,
}: {
  route: RouteProp<MainTabParamList, "TimeTable">;
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
  const [classData, setClassData] = useState<
    Class & {
      sections: fullSection[];
    }
  >();

  const updateEnrolledClasses = async () => {
    const data = await getEnrolledClasses(userContext);
    setEnrolledClasses(data);
  };

  useEffect(() => {
    updateEnrolledClasses();
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
    <KeyboardAwareScrollView
      style={{
        paddingTop: 100,
        display: "flex",
        marginBottom: 10,
      }}
    >
      <Text>
        login as {user?.firstName} {user?.lastName}
      </Text>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <Text
            key={i}
            style={{
              position: "absolute",
              top: i * 50,
              borderTopWidth: 1,
            }}
          >
            {i + 9}
          </Text>
        ))}

        <View
          style={{
            borderWidth: 1,
            borderRadius: 2,
            width: "100%",
            height: 600, // 9~9
            backgroundColor: "#ffffff",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <View
              key={i}
              style={{
                width: "100%",
                height: 1,
                position: "absolute",
                top: 50 * i,
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
          {enrolledClasses?.map((cls) =>
            cls.sections.map((section) =>
              section.classMeetings.map((meeting) =>
                meeting.meetingType !== "EXAM"
                  ? meeting.meetingDays
                      ?.split("")
                      .map((day) => (
                        <TimeBox
                          key={meeting.id + day}
                          day={dayCharToInt(day as meetingDayChar)}
                          design={cls.course.courseDesignation}
                          meeting={meeting}
                        />
                      ))
                  : null
              )
            )
          )}
        </View>
      </View>
      <TextInput
        style={{
          marginTop: 10,
          marginBottom: 10,
          height: 30,
          width: 200,
          backgroundColor: "#ffffff",
          borderRadius: 3,
        }}
        onChangeText={(text) => {
          setCourseKeyword(text.replace(/ /g, ""));
        }}
        autoCapitalize="none"
      />
      {searchedCourse ? (
        <View
          style={{ backgroundColor: "#ffffff", borderRadius: 2, padding: 4 }}
        >
          {searchedCourse.map((course) => (
            <View
              style={{
                borderBottomColor: "#505050",
                borderBottomWidth: 1,
              }}
              key={course.id}
            >
              <Pressable
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                  },
                  {
                    borderBottomColor: "#505050",
                    borderBottomWidth: 1,
                  },
                ]}
                onPress={() => setSelectedCourse(course)}
              >
                <Text>{course.title}</Text>
                <Text>{course.courseDesignation}</Text>
                <Text>{course.fullCourseDesignation}</Text>
              </Pressable>
              {selectedCourse?.id === course.id ? (
                <View
                  style={{
                    paddingHorizontal: 10,
                    margin: 10,
                    borderRadius: 4,
                    borderWidth: 1,
                  }}
                >
                  {selectedCourse?.classes ? (
                    selectedCourse.classes.map((cls) => (
                      <View
                        key={cls.id}
                        style={{
                          borderWidth: 1,
                          borderRadius: 2,
                          margin: 5,
                          padding: 5,
                        }}
                      >
                        <Pressable
                          onPress={() => {
                            setSelectedClass(cls);
                          }}
                          style={({ pressed }) => [
                            {
                              backgroundColor: pressed
                                ? "rgb(210, 230, 255)"
                                : "white",
                            },
                            {
                              marginBottom: 10,
                            },
                          ]}
                        >
                          {cls.sections.map((section) => (
                            <View key={section.id}>
                              <Text>
                                {section.type} {section.sectionNumber}
                              </Text>
                            </View>
                          ))}
                        </Pressable>
                        <Pressable
                          onPress={async () => {
                            if (
                              enrolledClasses
                                .map((cls) => cls.id)
                                .includes(cls.id)
                            ) {
                              await dropClass(userContext, cls.id);
                            } else {
                              await enrollClass(userContext, cls.id);
                            }
                            updateEnrolledClasses();
                          }}
                          style={({ pressed }) => [
                            {
                              backgroundColor: pressed
                                ? "rgb(210, 230, 255)"
                                : "white",
                            },
                            {
                              marginBottom: 10,
                            },
                          ]}
                        >
                          <Text>
                            {enrolledClasses
                              .map((cls) => cls.id)
                              .includes(cls.id)
                              ? "drop"
                              : "enroll"}
                          </Text>
                        </Pressable>
                        {selectedClass?.id === cls.id && classData
                          ? classData.sections.map((section) => (
                              <View
                                key={section.id}
                                style={{ marginBottom: 10 }}
                              >
                                <Text>
                                  {section.type} {section.sectionNumber}
                                </Text>
                                <View
                                  style={{
                                    borderWidth: 1,
                                    borderRadius: 2,
                                    padding: 2,
                                  }}
                                >
                                  <Text>meetings</Text>
                                  {section.classMeetings.map((meeting) => {
                                    const isExam =
                                      meeting.meetingType === "EXAM";
                                    const meetingTimeStart = new Date(
                                      meeting.meetingTimeStart
                                        ? meeting.meetingTimeStart
                                        : 0
                                    );
                                    const meetingTimeEnd = new Date(
                                      meeting.meetingTimeEnd
                                        ? meeting.meetingTimeEnd
                                        : 0
                                    );
                                    return (
                                      <View
                                        key={meeting.id}
                                        style={{ borderWidth: 1, margin: 1 }}
                                      >
                                        <Text>{meeting.meetingType}</Text>
                                        {!isExam ? (
                                          <Text>{meeting.meetingDays}</Text>
                                        ) : null}
                                        {meeting.examDate ? (
                                          <Text>
                                            {new Date(
                                              meeting.examDate +
                                                EXAMDATE_OFFSET || 0
                                            ).toDateString()}
                                          </Text>
                                        ) : null}
                                        {meetingTimeStart.valueOf() &&
                                        meetingTimeEnd.valueOf() ? (
                                          <Text>
                                            {meetingTimeStart.getHours() +
                                              ":" +
                                              meetingTimeStart.getMinutes() +
                                              " ~ " +
                                              meetingTimeEnd.getHours() +
                                              ":" +
                                              meetingTimeEnd.getMinutes()}
                                          </Text>
                                        ) : null}

                                        {meeting.building ? (
                                          <Text>
                                            {meeting.building.buildingName}
                                          </Text>
                                        ) : null}
                                      </View>
                                    );
                                  })}
                                  {section.instructor ? (
                                    <View>
                                      <Text>instructor:</Text>
                                      <Text>
                                        {section.instructor.firstName +
                                          " " +
                                          section.instructor.lastName}
                                      </Text>
                                    </View>
                                  ) : null}
                                </View>
                              </View>
                            ))
                          : null}
                      </View>
                    ))
                  ) : (
                    <Text>No section info</Text>
                  )}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          {
            marginTop: 30,
            padding: 10,
            marginBottom: 200,
          },
        ]}
        onPress={() => {
          userContext.setUser(undefined);
        }}
      >
        <Text>logout</Text>
      </Pressable>
    </KeyboardAwareScrollView>
  );
};

export default TimeTable;
