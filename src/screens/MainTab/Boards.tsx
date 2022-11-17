import { Board } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, BOARDS_KEY, colors, styles } from "../../constants";
import { getData, handleNotification, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText } from "../../components/StyledText";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import * as Notifications from "expo-notifications";
import { shadow } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Boards = () => {
  const [boards, setBoards] = useState<Board[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const cachedBoards = await AsyncStorage.getItem(BOARDS_KEY);
      if (cachedBoards) {
        setBoards(JSON.parse(cachedBoards));
      }
      const data = await postData(userContext, API_URL + "board/getBoards");
      console.log(data);
      if (data?.ok && data?.boards) {
        setBoards(data.boards);
        AsyncStorage.setItem(BOARDS_KEY, JSON.stringify(data.boards));
      }
    })();

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );
  }, []);

  if (!userContext.user) {
    return null;
  }

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        style={{
          paddingTop: "20%",
          paddingHorizontal: "8%",
        }}
      >
        <BoldText
          style={{
            fontSize: 18,
            color: colors.mediumThemeColor,
            marginBottom: 20,
          }}
        >
          {userContext.user.college.name}
        </BoldText>
        {boards ? (
          boards?.length ? (
            boards.map((board) => (
              <MyPressable
                key={board.id}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                  backgroundColor: "white",

                  ...shadow.md,

                  borderColor: colors.themeColor,
                  borderRadius: styles.borderRadius.md,
                  marginBottom: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() =>
                  navigation.push("Board", { id: board.id, title: board.title })
                }
              >
                <BoldText
                  style={{ fontSize: 24, color: colors.mediumThemeColor }}
                >
                  {board.title}
                </BoldText>
              </MyPressable>
            ))
          ) : (
            <BoldText
              style={{
                color: colors.mediumThemeColor,
                marginBottom: 20,
              }}
            >
              There's no boards in your college.
            </BoldText>
          )
        ) : (
          <View
            style={{
              height: 100,
              justifyContent: "center",
            }}
          >
            <LoadingComponent />
          </View>
        )}
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Boards;
