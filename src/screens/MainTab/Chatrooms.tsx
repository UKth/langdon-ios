import { ChatroomForChatroomsList } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, CHATROOMS_KEY, colors, styles } from "../../constants";
import { getTimeString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { BoldText } from "../../components/StyledText";
import {
  ChatroomComponent,
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import * as Notifications from "expo-notifications";
import { handleNotification } from "./TimeTable";
import { shadow } from "../../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chatrooms = () => {
  const [chatrooms, setChatrooms] = useState<ChatroomForChatroomsList[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const { user } = userContext;
  if (!user) {
    return <ErrorComponent />;
  }

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "chat/getChatrooms");
    if (data?.ok && data?.chatrooms) {
      setChatrooms(data.chatrooms);
      AsyncStorage.setItem(CHATROOMS_KEY, JSON.stringify(data.chatrooms));
    } else {
      Alert.alert(data?.error ?? "Failed to get chatrooms.");
    }
  };

  useEffect(() => {
    (async () => {
      const cachedChatrooms = await AsyncStorage.getItem(CHATROOMS_KEY);
      if (cachedChatrooms) {
        setChatrooms(JSON.parse(cachedChatrooms)); // may produce error
      }
      refetch();
    })();

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
      {chatrooms ? (
        chatrooms.length ? (
          <FlatList
            style={{ paddingHorizontal: "8%" }}
            data={chatrooms}
            ListHeaderComponent={() => <View style={{ height: 40 }} />}
            ListFooterComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(chatroom) => chatroom.id + ""}
            renderItem={({ item: chatroom }) => (
              <ChatroomComponent chatroom={chatroom} user={user} />
            )}
          />
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
    </ScreenContainer>
  );
};

export default Chatrooms;
