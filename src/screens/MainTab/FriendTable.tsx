import {
  Class,
  ClassMeetingWithBuilding,
  Course,
  FullSection,
  TableWithClasses,
} from "@customTypes/models";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/userContext";
import { getTable } from "../../apiFunctions";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { ProgressContext } from "../../contexts/progressContext";
import {
  CoursePopUpBox,
  MyPressable,
  ScreenContainer,
  TimeTableComponent,
} from "../../components";
import { Alert, ScrollView, View } from "react-native";
import { BoldText } from "../../components/StyledText";
import { API_URL, colors } from "../../constants";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { postData } from "../../util";
import { MainTabParamList } from "../../navigation/MainTab";

const FriendTable = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "FriendTable">;
}) => {
  const userContext = useContext(UserContext);
  const targetId = route.params.id;

  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const [table, setTable] = useState<TableWithClasses>();
  const [popUpBoxData, setPopUpBoxData] = useState<{
    cls: Class & {
      sections: FullSection[];
    } & {
      course: Course;
    };
    meeting: ClassMeetingWithBuilding;
  }>();

  const { spinner } = useContext(ProgressContext);

  const updateTable = async () => {
    const data = await getTable(userContext, { targetId });
    if (data) {
      setTable(data);
    }
  };
  // console.log(navigation.getParent());

  const openChatroom = async () => {
    spinner.start();
    const data = await postData(userContext, API_URL + "chat/checkChatroom", {
      targetId,
    });
    spinner.stop();
    if (data?.ok) {
      if (data.chatroomId) {
        navigation.push("Chatroom", { id: data.chatroomId });
      } else {
        navigation.push("SendFirstMessage", { targetId, isAnonymous: false });
      }
    } else {
      Alert.alert(data?.error ?? "Failed to get chatroom", "Please try again");
    }
  };

  useEffect(() => {
    (async () => {
      spinner.start();
      await updateTable();
      spinner.stop();
    })();
    navigation.setOptions({
      headerRight: () => (
        <MyPressable
          hitSlop={{
            top: 10,
            bottom: 10,
            right: 10,
            left: 10,
          }}
          style={{
            marginRight: 5,
            marginTop: 5,
            // backgroundColor: "#182904",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={openChatroom}
        >
          <Ionicons
            name="paper-plane"
            size={23}
            color={colors.mediumThemeColor}
          />
        </MyPressable>
      ),
    });
  }, [userContext]);

  return (
    <ScreenContainer>
      <ScrollView style={{ paddingTop: "5%", paddingHorizontal: "1%" }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <BoldText style={{ fontSize: 17, color: colors.mediumThemeColor }}>
            {table?.title}
          </BoldText>
        </View>
        <TimeTableComponent
          enrolledClasses={table?.enrolledClasses}
          setPopUpBoxData={setPopUpBoxData}
        />
      </ScrollView>
      {table && popUpBoxData ? (
        <CoursePopUpBox
          cls={popUpBoxData.cls}
          meeting={popUpBoxData.meeting}
          closePopUp={() => setPopUpBoxData(undefined)}
          table={table}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default FriendTable;
