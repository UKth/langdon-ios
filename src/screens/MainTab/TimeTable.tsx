import {
  Class,
  ClassMeetingWithBuilding,
  classWithSections,
  Course,
  fullSection,
} from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { debounce, getData, getNameString, logout } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { getEnrolledClasses } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_URL, colors, ENROLLED_CLASSES_KEY } from "../../constants";
import { BoldText } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/Progress";
import {
  CoursePopUpBox,
  ErrorComponent,
  MyPressable,
  ScreenContainer,
  TimeTableComponent,
} from "../../components";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import { shadow } from "../../constants/styles";
import * as Linking from "expo-linking";
import { EventType } from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type pushNotificationData = {
  route: string;
  params: StackGeneratorParamList[keyof StackGeneratorParamList];
};

export const handleNotification = ({
  navigation,
  notification,
}: {
  navigation: NativeStackNavigationProp<StackGeneratorParamList>;
  notification: Notifications.Notification;
}) => {
  const data = notification.request.content.data as pushNotificationData;

  if (["Post", "Chatrooms"].includes(data.route)) {
    if (data.route === "Post") {
      const params = data.params as StackGeneratorParamList["Post"];
      if (params.id) {
        navigation.push("Post", params);
      }
    } else if (data.route === "Chatrooms") {
      navigation.push("Chatrooms");
    }
  }
};

const TimeTable = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "TimeTable">;
}) => {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (!user) {
    return <ErrorComponent />;
  }

  const [enrolledClasses, setEnrolledClasses] = useState<
    (classWithSections & { course: Course })[]
  >([]);
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
    AsyncStorage.setItem(ENROLLED_CLASSES_KEY, JSON.stringify(data));
  };

  useEffect(() => {
    (async () => {
      const cachedClasses = await AsyncStorage.getItem(ENROLLED_CLASSES_KEY);
      if (!cachedClasses) {
        spinner.start();
      } else {
        setEnrolledClasses(JSON.parse(cachedClasses)); // may produce error
      }
      await updateEnrolledClasses();
      spinner.stop();
    })();
    navigation.addListener("focus", updateEnrolledClasses);

    // Notifications.addNotificationReceivedListener((notification) => {
    //   console.log("rl\n");
    //   logJSON(notification);
    // });
    console.log(Linking.createURL("path"));

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );

    return () => navigation.removeListener("focus", updateEnrolledClasses);
  }, []);

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
            logged in as {getNameString(user)}
          </BoldText>
          <View style={{ flexDirection: "row" }}>
            <MyPressable
              style={{
                marginRight: 10,
                backgroundColor: "white",
                width: 30,
                height: 30,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "center",
                ...shadow.md,
              }}
              onPress={() => navigation.push("Friends")}
            >
              <Ionicons
                name="people"
                size={20}
                color={colors.mediumThemeColor}
              />
            </MyPressable>
            <MyPressable
              style={{
                borderRadius: 30,
                padding: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                ...shadow.md,
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
        </View>
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

export default TimeTable;
