import {
  Class,
  ClassMeetingWithBuilding,
  ClassWithSections,
  Course,
  FullSection,
  Table,
} from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from "../../contexts/userContext";
import { getTable } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, TABLE_KEY } from "../../constants";
import { BoldText } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/progressContext";
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

const TimeTable = () => {
  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (!user) {
    return <ErrorComponent />;
  }

  const [popUpBoxData, setPopUpBoxData] = useState<{
    cls: Class & {
      sections: FullSection[];
    } & {
      course: Course;
    };
    meeting: ClassMeetingWithBuilding;
  }>();
  const [table, setTable] = useState<Table>();

  const { spinner } = useContext(ProgressContext);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const updateTable = async () => {
    const data = await getTable(userContext);
    if (data) {
      setTable(data);
      AsyncStorage.setItem(TABLE_KEY, JSON.stringify(data));
    }
  };

  useEffect(() => {
    (async () => {
      const cachedTable = await AsyncStorage.getItem(TABLE_KEY);
      if (!cachedTable) {
        spinner.start();
      } else {
        setTable(JSON.parse(cachedTable)); // may produce error
      }
      await updateTable();
      spinner.stop();
    })();
    navigation.addListener("focus", updateTable);

    // Notifications.addNotificationReceivedListener((notification) => {
    //   console.log("rl\n");
    //   logJSON(notification);
    // });

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );

    return () => navigation.removeListener("focus", updateTable);
  }, []);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView style={{ paddingHorizontal: "1%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <BoldText style={{ fontSize: 17, color: colors.mediumThemeColor }}>
            {table?.title}
          </BoldText>
          <View style={{ flexDirection: "row" }}>
            <MyPressable
              style={{
                marginRight: 10,
                backgroundColor: "white",
                width: 35,
                height: 35,
                borderRadius: 35,
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
                borderRadius: 35,
                width: 35,
                height: 35,
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
          enrolledClasses={table?.enrolledClasses ?? []}
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
