import { User } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { API_URL, colors, WEB_URL } from "../../constants";
import { getNameString, postData } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import {
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BoldText } from "../../components/StyledText";
import { Alert, Share, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { shadow } from "../../constants/styles";
import { ProgressContext } from "../../contexts/progressContext";

const Friends = () => {
  const [friends, setFriends] = useState<User[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const [code, setCode] = useState();
  const { spinner } = useContext(ProgressContext);

  if (!user) {
    return <ErrorComponent />;
  }

  const createFriendRequest = async () => {
    spinner.start();
    const data = await postData(
      userContext,
      API_URL + "friend/createFriendRequest"
    );
    spinner.stop();

    if (!data?.ok) {
      Alert.alert(data?.error ?? "Failed with create friend request.");
    }
    if (data?.code) {
      setCode(data.code);
    }
  };

  useEffect(() => {
    (async () => {
      if (code) {
        try {
          const result = await Share.share({
            url: WEB_URL + "addFriend?targetId=" + user.id + "&code=" + code,
          });

          // if (result.action === Share.sharedAction) {
          // } else if (result.action === Share.dismissedAction) {
          //   // dismissed
          // }
        } catch (error) {
          alert(error);
        }
      }
    })();
  }, [code]);

  useEffect(() => {
    (async () => {
      const data = await postData(userContext, API_URL + "friend/getFriends");
      if (data?.ok) {
        setFriends(data?.friendsData);
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
          paddingTop: "10%",
          paddingHorizontal: "8%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 20,
            paddingHorizontal: 10,
          }}
        >
          {friends ? (
            <MyPressable
              style={{
                borderRadius: 30,
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                ...shadow.md,
              }}
              onPress={createFriendRequest}
            >
              <View
                style={{
                  position: "absolute",
                  width: 15,
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: colors.themeColor,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  width: 2,
                  height: 15,
                  borderRadius: 2,
                  backgroundColor: colors.mediumThemeColor,
                }}
              />
            </MyPressable>
          ) : null}
        </View>
        {friends ? (
          friends?.length ? (
            friends.map((friend) => (
              <MyPressable
                key={friend.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  marginBottom: 10,
                  ...shadow.md,
                  borderRadius: styles.borderRadius.md,
                }}
                onPress={() =>
                  navigation.push("FriendTable", {
                    id: friend.id,
                    nameString: getNameString(friend),
                  })
                }
              >
                <BoldText
                  style={{ fontSize: 15, color: colors.mediumThemeColor }}
                >
                  {getNameString(friend)} @{friend.netId}
                </BoldText>
                <Ionicons
                  name="ios-calendar-sharp"
                  size={20}
                  color={colors.mediumThemeColor}
                />
              </MyPressable>
            ))
          ) : (
            <View>
              <BoldText style={{ color: colors.mediumThemeColor }}>
                You don't have any friends...? TT
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

export default Friends;
