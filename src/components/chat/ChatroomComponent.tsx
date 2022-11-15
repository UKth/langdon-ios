import { ChatroomForChatroomsList, User } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { View } from "react-native";
import { getTimeString } from "../../util";
import { colors, styles } from "../../constants";
import { shadow } from "../../constants/styles";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import MyPressable from "../shared/MyPressable";
import { BoldText } from "../StyledText";

type ChatroomComponentProps = {
  chatroom: ChatroomForChatroomsList;
  user: User;
};

const ChatroomComponent = ({ chatroom, user }: ChatroomComponentProps) => {
  // const theme = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  return (
    <MyPressable
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
      <View style={{ alignItems: "flex-end" }}>
        <BoldText style={{ fontSize: 10, color: colors.lightThemeColor }}>
          {getTimeString(chatroom.lastMessage.createdAt)}
        </BoldText>
        {!chatroom.isAnonymous ? (
          <BoldText
            style={{
              fontSize: 10,
              color: colors.mediumThemeColor,
              marginTop: 2,
            }}
          >
            @
            {chatroom.members[chatroom.members[0].id === user.id ? 1 : 0].netId}
          </BoldText>
        ) : chatroom.post ? (
          <BoldText
            style={{
              fontSize: 10,
              width: 90,
              color: colors.mediumThemeColor,
              marginTop: 2,
              textAlign: "right",
            }}
            numberOfLines={1}
          >
            {chatroom.post.title}
          </BoldText>
        ) : null}
      </View>
    </MyPressable>
  );
};

export default ChatroomComponent;
