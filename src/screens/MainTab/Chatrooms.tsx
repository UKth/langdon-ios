import { ChatroomForChatroomsList } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, CHATROOMS_KEY, colors, styles } from "../../constants";
import {
  getTimeString,
  handleNotification,
  loadData,
  postData,
} from "../../util";
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

  const [refreshing, setRefreshing] = useState(false);

  const fetch = async (lastId?: number) => {
    const data = await postData(userContext, API_URL + "chat/getChatrooms", {
      lastId,
    });
    if (data?.ok && data.chatrooms) {
      loadData({
        data: chatrooms,
        setData: setChatrooms,
        loadedData: data.chatrooms,
        lastId: data.lastId,
      });
      if (!lastId) {
        AsyncStorage.setItem(CHATROOMS_KEY, JSON.stringify(data.chatrooms));
      }
    } else {
      Alert.alert(data?.error ?? "Failed to get chatrooms.");
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      const cachedChatrooms = await AsyncStorage.getItem(CHATROOMS_KEY);
      if (cachedChatrooms) {
        setChatrooms(JSON.parse(cachedChatrooms)); // may produce error
      }
      refresh();
    })();

    Notifications.addNotificationResponseReceivedListener(({ notification }) =>
      handleNotification({ navigation, notification })
    );
  }, []);

  useEffect(() => {
    if (!chatrooms) {
      navigation.addListener("focus", refresh);
      return () => navigation.removeListener("focus", refresh);
    }
  }, [chatrooms]); // TODO: Not working

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
            refreshing={refreshing}
            onRefresh={refresh}
            ListHeaderComponent={() => <View style={{ height: 40 }} />}
            ListFooterComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(chatroom) => chatroom.id + ""}
            renderItem={({ item: chatroom }) => (
              <ChatroomComponent chatroom={chatroom} user={user} />
            )}
            onEndReached={() => fetch(chatrooms[chatrooms.length - 1].id)}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View
            style={{
              paddingHorizontal: "10%",
              paddingTop: "10%",
            }}
          >
            <BoldText style={{ color: colors.mediumThemeColor, fontSize: 18 }}>
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
