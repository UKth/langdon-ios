import { Board } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, colors } from "../../constants";
import { getData, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText } from "../../components/StyledText";
import { MyPressable, ScreenContainer } from "../../components";

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
          display: "flex",
          marginBottom: 10,
        }}
      >
        <BoldText
          style={{
            fontSize: 18,
            color: colors.mediumThemeColor,
            marginBottom: 15,
          }}
        >
          {userContext.user.college.name}
        </BoldText>
        {boards.length ? (
          boards.map((board) => (
            <MyPressable
              key={board.id}
              style={{
                width: "100%",
                backgroundColor: colors.lightThemeColor,
                marginBottom: 10,
                borderRadius: 15,
                height: 40,
                justifyContent: "center",
                paddingHorizontal: 20,
              }}
              onPress={() =>
                navigation.push("Board", { id: board.id, title: board.title })
              }
            >
              <BoldText style={{ fontSize: 20 }}>{board.title}</BoldText>
            </MyPressable>
          ))
        ) : (
          <View
            style={{
              height: 100,
              justifyContent: "center",
            }}
          >
            <ActivityIndicator size="small" color={colors.mediumThemeColor} />
          </View>
        )}
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Boards;
