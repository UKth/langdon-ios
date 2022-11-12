import {
  Board,
  ChatroomWithLastMessage,
  Message,
  Post,
} from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, colors, styles } from "../../constants";
import { getData, getTimeDifferenceString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import {
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import * as Notifications from "expo-notifications";
import { handleNotification } from "./TimeTable";
import { shadow } from "../../constants/styles";
import { ProgressContext } from "../../contexts/Progress";
import { Ionicons } from "@expo/vector-icons";

const Chatroom = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Chatroom">;
}) => {
  const [messages, setMessages] = useState<Message[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const chatroomId = route.params.id;
  const [msgText, setMsgText] = useState("");
  const [post, setPost] = useState<Post>();

  const { spinner } = useContext(ProgressContext);

  const refetch = async () => {
    const data = await postData(
      userContext,
      API_URL + "chat/message/getChatroomMessages",
      { chatroomId }
    );

    if (data?.ok && data?.messages) {
      setMessages(data?.messages);
    } else {
      Alert.alert(data?.error ?? "Failed to get chatrooms.");
    }
    if (data?.post) {
      setPost(data.post);
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

  if (!user) {
    return <ErrorComponent />;
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={90}
        style={{ flex: 1 }}
      >
        {post ? (
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
              onPress={() => navigation.push("Post", { id: post.id })}
            >
              <BoldText
                style={{
                  fontSize: 16,
                  marginBottom: 5,
                  color: colors.mediumThemeColor,
                }}
                numberOfLines={1}
              >
                Chatroom created by post:
              </BoldText>
              <BoldText
                style={{
                  fontSize: 13,
                  color: colors.mediumThemeColor,
                }}
                numberOfLines={1}
              >
                {post.title}
              </BoldText>
            </MyPressable>
          </View>
        ) : null}
        <FlatList
          style={{ paddingHorizontal: "5%", paddingTop: "10%" }}
          data={messages}
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
              // borderLeftWidth: 1,
              // borderColor: colors.lightThemeColor,
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
