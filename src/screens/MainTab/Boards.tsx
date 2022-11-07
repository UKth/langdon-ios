import { Board } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, colors, styles } from "../../constants";
import { getData, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText } from "../../components/StyledText";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";

const Boards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const data = await postData(userContext, API_URL + "board/getBoards");
      if (data?.ok) {
        setBoards(data?.boards);
      }
    })();
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
        {boards?.length ? (
          boards.map((board) => (
            <MyPressable
              key={board.id}
              style={{
                paddingVertical: 15,
                paddingHorizontal: 18,
                maxHeight: "30%",
                backgroundColor: "white",

                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 2,
                shadowColor: `rgba(0,0,0,0.1)`,
                shadowOpacity: 1,

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
