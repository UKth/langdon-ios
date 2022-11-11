import { Board, ChatroomWithLastMessage } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, colors, styles } from "../../constants";
import { getData, getTimeString, postData } from "../../util";
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
import { handleNotification } from "./TimeTable";
import { shadow } from "../../constants/styles";

const Chatrooms = () => {
  const [chatrooms, setChatrooms] = useState<ChatroomWithLastMessage[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "chat/getChatrooms");
    if (data?.ok && data?.chatrooms) {
      setChatrooms(data?.chatrooms);
    } else {
      Alert.alert(data?.error ?? "Failed to get chatrooms.");
    }
  };

  useEffect(() => {
    refetch();

    navigation.addListener("focus", refetch);

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );
    return () => navigation.removeListener("focus", refetch);
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
        {chatrooms ? (
          chatrooms.length ? (
            chatrooms.map((chatroom) => (
              <MyPressable
                key={chatroom.id}
                style={{
                  paddingVertical: 15,
                  paddingHorizontal: 18,
                  backgroundColor: "white",
                  borderColor: colors.themeColor,
                  borderRadius: styles.borderRadius.md,
                  marginBottom: 15,
                  ...shadow.md,

                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => navigation.push("Chatroom", { id: chatroom.id })}
              >
                <BoldText
                  style={{
                    fontSize: 15,
                    color: colors.mediumThemeColor,
                    maxWidth: "75%",
                    marginRight: 3,
                  }}
                  numberOfLines={1}
                >
                  {chatroom.lastMessage.content}
                </BoldText>
                <BoldText
                  style={{ fontSize: 10, color: colors.lightThemeColor }}
                >
                  {getTimeString(chatroom.lastMessage.createdAt)}
                </BoldText>
              </MyPressable>
            ))
          ) : (
            <View>
              <BoldText style={{ color: colors.mediumThemeColor }}>
                You don't have any chatrooms.
              </BoldText>
            </View>
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

export default Chatrooms;
