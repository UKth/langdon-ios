import { FullChatroom, Message, TargetUser } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, KeyboardAvoidingView, View } from "react-native";
import { API_URL, colors, styles } from "../../constants";
import { getNameString, getTimeDifferenceString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { ErrorComponent, MyPressable, ScreenContainer } from "../../components";
import * as Notifications from "expo-notifications";
import { handleNotification } from "./TimeTable";
import { shadow } from "../../constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/progressContext";

const Chatroom = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Chatroom">;
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const user = userContext.user;

  const chatroomId = route.params.id;
  const [msgText, setMsgText] = useState("");
  const [chatroom, setChatroom] = useState<FullChatroom>();
  const [targetUser, setTargetUser] = useState<TargetUser>();

  const { spinner } = useContext(ProgressContext);

  if (!user) {
    return <ErrorComponent />;
  }

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "chat/getChatroom", {
      chatroomId,
    });

    if (data?.ok && data?.chatroom) {
      setChatroom(data.chatroom);
    } else {
      Alert.alert(data?.error ?? "Failed to get chatroom.");
    }
  };

  const sendMessage = async (text: string) => {
    if (text.length > 0) {
      setMsgText("");
      spinner.start();
      await postData(userContext, API_URL + "chat/message/sendMessage", {
        chatroomId,
        content: text,
      });
      await refetch();
      spinner.stop();
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

  useEffect(() => {
    if (chatroom?.members) {
      setTargetUser(
        chatroom.members[chatroom.members[0].id === user.id ? 1 : 0]
      );
    }
  }, [chatroom]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        {chatroom?.post ? (
          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            <MyPressable
              style={{
                backgroundColor: "white",
                borderRadius: styles.borderRadius.md,
                paddingHorizontal: 20,
                paddingVertical: 15,
                marginBottom: 3,
                ...shadow.md,
              }}
              onPress={() => navigation.push("Post", { id: chatroom.post.id })}
            >
              <BoldText
                style={{
                  fontSize: 14,
                  marginBottom: 5,
                  color: colors.mediumThemeColor,
                }}
                numberOfLines={1}
              >
                Chatroom created by post:
              </BoldText>
              <BoldText
                style={{
                  fontSize: 11,
                  color: colors.mediumThemeColor,
                }}
                numberOfLines={1}
              >
                {chatroom.post.title}
              </BoldText>
            </MyPressable>
          </View>
        ) : chatroom && !chatroom.isAnonymous ? (
          <View style={{ paddingTop: 10, paddingHorizontal: 10 }}>
            <MyPressable
              style={{
                backgroundColor: "white",
                borderRadius: styles.borderRadius.md,
                paddingHorizontal: 20,
                paddingVertical: 15,
                marginBottom: 3,
                ...shadow.md,
              }}
              onPress={() =>
                targetUser &&
                navigation.push("FriendTable", {
                  id: targetUser?.id,
                  nameString: getNameString(targetUser), //TODO - fix
                })
              }
            >
              <BoldText
                style={{
                  fontSize: 13,
                  marginBottom: 5,
                  color: colors.mediumThemeColor,
                }}
                numberOfLines={1}
              >
                Personal chat with @{targetUser?.netId ?? "id not found"}
              </BoldText>
            </MyPressable>
          </View>
        ) : null}
        <FlatList
          style={{
            paddingHorizontal: "5%",
          }}
          ListFooterComponent={() => <View style={{ height: 10 }} />}
          data={chatroom?.messages}
          inverted={true}
          renderItem={({ item: message }) => {
            const isMine = message.userId === user.id;
            return (
              <View style={{ alignItems: isMine ? "flex-end" : "flex-start" }}>
                <View
                  key={message.id}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    backgroundColor: "white",
                    width: "80%",

                    borderRadius: styles.borderRadius.md,
                    marginBottom: 15,
                    flexDirection: "row",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    alignItems: "center",
                    ...shadow.md,
                  }}
                >
                  <View
                    style={{ alignItems: isMine ? "flex-end" : "flex-start" }}
                  >
                    <BoldText
                      style={{
                        fontSize: 12,
                        color: colors.mediumThemeColor,
                        marginBottom: 2,
                      }}
                    >
                      {message.content}
                    </BoldText>
                    <BoldText
                      style={{ fontSize: 10, color: colors.lightThemeColor }}
                    >
                      {getTimeDifferenceString(message.createdAt)}
                    </BoldText>
                  </View>
                </View>
              </View>
            );
          }}
        />
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 10,
            paddingVertical: 10,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            marginHorizontal: 10,
            marginBottom: 5,

            // position: "absolute",
            // bottom: 10,

            ...shadow.md,
          }}
        >
          <BoldTextInput
            style={{
              flex: 1,
              color: colors.mediumThemeColor,
              fontSize: 16,
              padding: 8,
              borderRadius: 4,
              marginRight: 10,
            }}
            placeholder="type message..."
            placeholderTextColor={colors.lightThemeColor}
            value={msgText}
            multiline={true}
            maxLength={200}
            onChangeText={(text) => setMsgText(text)}
          />
          <MyPressable
            style={{
              width: 50,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => sendMessage(msgText.trim())}
          >
            <Ionicons
              name="paper-plane"
              size={23}
              color={colors.mediumThemeColor}
            />
          </MyPressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default Chatroom;
