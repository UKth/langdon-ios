import {
  Class,
  ClassMeetingWithBuilding,
  ClassWithSections,
  Course,
  FullSection,
} from "@customTypes/models";
import { RouteProp } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from "../../contexts/userContext";
import { getEnrolledClasses } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { ProgressContext } from "../../contexts/progressContext";
import {
  CoursePopUpBox,
  ScreenContainer,
  TimeTableComponent,
} from "../../components";

const FriendTable = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "FriendTable">;
}) => {
  const userContext = useContext(UserContext);
  const targetId = route.params.id;

  const [enrolledClasses, setEnrolledClasses] = useState<
    (ClassWithSections & { course: Course })[]
  >([]);
  const [popUpBoxData, setPopUpBoxData] = useState<{
    cls: Class & {
      sections: FullSection[];
    } & {
      course: Course;
    };
    meeting: ClassMeetingWithBuilding;
  }>();

  const { spinner } = useContext(ProgressContext);

  const updateEnrolledClasses = async () => {
    const data = await getEnrolledClasses(userContext, targetId);
    setEnrolledClasses(data);
  };

  useEffect(() => {
    (async () => {
      spinner.start();
      await updateEnrolledClasses();
      spinner.stop();
    })();
  }, []);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView>
        <TimeTableComponent
          enrolledClasses={enrolledClasses}
          setPopUpBoxData={setPopUpBoxData}
        />
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

export default FriendTable;
