import {
  Class,
  ClassMeetingWithBuilding,
  Course,
  FullSection,
  TableWithClasses,
} from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { ActionSheetIOS, Alert, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserContext } from "../../contexts/userContext";
import { getTable } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_URL, colors, TABLE_KEY, termNames } from "../../constants";
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
import { Ionicons, Octicons } from "@expo/vector-icons";
import { shadow } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleNotification, postData } from "../../util";

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
  const tableId = route?.params?.tableId ?? user.defaultTableId;

  const [popUpBoxData, setPopUpBoxData] = useState<{
    cls: Class & {
      sections: FullSection[];
    } & {
      course: Course;
    };
    section: FullSection;
    meeting: ClassMeetingWithBuilding;
  }>();
  const [table, setTable] = useState<TableWithClasses>();

  const { spinner } = useContext(ProgressContext);

  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const onPressMenu = () => {
    if (!table) {
      return;
    }
    const isDefault = user.defaultTableId === table.id;
    if (isDefault) {
      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Table", "Set table as a public table"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        // userInterfaceStyle: 'dark',
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          spinner.start();
          const data = await postData(
            userContext,
            API_URL + "table/deleteTable",
            {
              tableId: table.id,
            }
          );
          spinner.stop();
          if (data?.ok) {
            Alert.alert("Table deleted.");
            navigation.pop();
          } else {
            Alert.alert("Deletion failed.", data.error ?? "Please try again.");
          }
        } else if (buttonIndex === 2) {
          spinner.start();
          const data = await postData(
            userContext,
            API_URL + "table/setDefaultTable",
            {
              tableId: table.id,
            }
          );
          spinner.stop();
          if (data?.ok) {
            Alert.alert("The table set as a public table.");
            userContext.setUser({
              ...user,
              defaultTableId: table.id,
            });
          } else {
            Alert.alert("Set failed.", data.error ?? "Please try again.");
          }
        }
      }
    );
  };

  const updateTable = async () => {
    const data = await getTable(userContext, { tableId });
    if (data) {
      setTable(data);
    }
  };

  const updateUser = async () => {
    // const data = await postData(userContext, API_URL + "user/getUser");
    // if (data?.ok && data.user) {
    //   userContext.setUser(data.user);
    // }
  };

  const updateData = async () => {
    updateUser();
    updateTable();
  };

  useEffect(() => {
    if (table) {
      AsyncStorage.setItem(TABLE_KEY + table.id, JSON.stringify(table));
    }
  }, [table]);

  const restoreData = async () => {
    const cachedTable = await AsyncStorage.getItem(TABLE_KEY + tableId);
    if (!cachedTable) {
      spinner.start();
    } else {
      setTable(JSON.parse(cachedTable)); // may produce error
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        tableId !== user.defaultTableId ? (
          <MyPressable onPress={onPressMenu}>
            <Ionicons name={"menu"} size={22} color={colors.mediumThemeColor} />
          </MyPressable>
        ) : null,
    });
  }, [user, table]);

  useEffect(() => {
    (async () => {
      const cachedTable = await AsyncStorage.getItem(TABLE_KEY + tableId);
      if (!cachedTable) {
        spinner.start();
      } else {
        setTable(JSON.parse(cachedTable)); // may produce error
      }
      await updateData(); // TODO: double alert (focus listener)
      spinner.stop();
    })();

    navigation.addListener("focus", updateData);

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );

    return () => navigation.removeListener("focus", updateData);
  }, [user]);

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
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View>
              {table && table.title !== termNames[table.termCode] ? (
                <BoldText
                  style={{ fontSize: 12, color: colors.lightThemeColor }}
                >
                  {termNames[table.termCode]}
                </BoldText>
              ) : null}

              <BoldText
                style={{
                  fontSize: 17,
                  color: colors.mediumThemeColor,
                  marginRight: 5,
                }}
              >
                {table?.title}
              </BoldText>
            </View>
            {user.defaultTableId === table?.id ? (
              <MyPressable
                onPress={() =>
                  Alert.alert(
                    "Public table",
                    "The table is shown to your friends"
                  )
                }
              >
                <Octicons name="pin" size={16} color={colors.lightThemeColor} />
              </MyPressable>
            ) : null}
          </View>
          <View style={{ flexDirection: "row" }}>
            {route?.params?.tableId ? null : (
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
                onPress={() => navigation.push("Tables")}
              >
                <Ionicons
                  name="ios-calendar-outline"
                  size={20}
                  color={colors.mediumThemeColor}
                />
              </MyPressable>
            )}
            {route?.params?.tableId ? null : (
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
            )}
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
              onPress={() => {
                if (table) {
                  navigation.push("EnrollClasses", {
                    tableId: table.id,
                    tableTitle: table?.title,
                  });
                }
              }}
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
        <TimeTableComponent table={table} setPopUpBoxData={setPopUpBoxData} />
      </KeyboardAwareScrollView>
      {table && table.userId === user.id && popUpBoxData ? (
        <CoursePopUpBox
          {...popUpBoxData}
          closePopUp={() => {
            updateData();
            setPopUpBoxData(undefined);
          }}
          table={table}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default TimeTable;
