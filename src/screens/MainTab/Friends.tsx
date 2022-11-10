import { User } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { API_URL, colors } from "../../constants";
import { getNameString, postData } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BoldText } from "../../components/StyledText";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Friends = () => {
  const [friends, setFriends] = useState<User[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const data = await postData(userContext, API_URL + "friend/getFriends");
      console.log(data);
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
          paddingTop: "20%",
          paddingHorizontal: "8%",
        }}
      >
        {friends ? (
          friends?.length ? (
            friends.map((friend) => (
              <MyPressable
                key={friend.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={() =>
                  navigation.push("FriendTable", {
                    id: friend.id,
                    nameString: getNameString(friend),
                  })
                }
              >
                <BoldText
                  style={{ fontSize: 20, color: colors.mediumThemeColor }}
                >
                  {getNameString(friend)}
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
