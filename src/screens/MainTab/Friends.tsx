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

  const updateFriends = async () => {
    const data = await postData(userContext, API_URL + "friend/getFriends");
    if (data?.ok) {
      setFriends(data?.friendsData);
    }
  };

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

  const deleteFriend = async (targetId: number) => {
    spinner.start();
    const data = await postData(userContext, API_URL + "friend/deleteFriend", {
      targetId,
    });
    spinner.stop();

    if (data?.ok) {
      Alert.alert("Friend deleted.");
      updateFriends();
    } else {
      Alert.alert(data?.error ?? "Failed to delete friend.");
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
    updateFriends();
  }, []);

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
                width: 35,
                height: 35,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                ...shadow.md,
              }}
              onPress={createFriendRequest}
            >
              <Ionicons
                name="person-add"
                size={17}
                color={colors.themeColor}
                style={{ opacity: 0.5 }}
              />
            </MyPressable>
          ) : null}
        </View>
        {friends ? (
          friends?.length ? (
            friends.map((friend) => (
              <View
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
              >
                <MyPressable
                  onPress={() =>
                    navigation.push("FriendTable", {
                      id: friend.id,
                      nameString: getNameString(friend),
                    })
                  }
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                  }}
                  style={{
                    width: "90%",
                  }}
                >
                  <BoldText
                    style={{
                      fontSize: 15,
                      color: colors.mediumThemeColor,
                    }}
                    numberOfLines={1}
                  >
                    {getNameString(friend)} @{friend.netId}
                  </BoldText>
                </MyPressable>
                <MyPressable
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    right: 10,
                  }}
                  style={{ paddingHorizontal: 5 }}
                  onPress={() => {
                    Alert.alert(
                      "Delete friend",
                      "Are you sure to delete this friend?",
                      [
                        {
                          text: "Yes",
                          onPress: () => deleteFriend(friend.id),
                        },
                        {
                          text: "cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons
                    name="ios-trash"
                    size={20}
                    color={colors.mediumThemeColor}
                  />
                </MyPressable>
              </View>
            ))
          ) : (
            <View>
              <BoldText style={{ color: colors.mediumThemeColor }}>
                You don't have any friends... TT
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
