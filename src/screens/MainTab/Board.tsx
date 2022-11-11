import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getTimeDifferenceString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { ANONYMOUS_USERNAME, API_URL, colors, styles } from "../../constants";
import { BoldText } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/Progress";
import { shadow } from "../../constants/styles";

const BoardScreen = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Board">;
}) => {
  const [posts, setPosts] = useState<PostWithCounts[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const boardId = route.params.id;
  const [refreshing, setRefreshing] = useState(false);
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyPressable onPress={() => navigation.push("WritePost", { boardId })}>
          <Ionicons
            name="ios-create-outline"
            size={26}
            color={colors.themeColor}
          />
        </MyPressable>
      ),
      headerTitle: route.params.title,
    });
  }, []);

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "board/post/getPosts", {
      boardId,
    });
    if (data?.ok) {
      setPosts(data.posts);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", refetch);
    return () => navigation.removeListener("focus", refetch);
  }, []);

  return (
    <ScreenContainer style={{ backgroundColor: "rgba(255,255,255,1)" }}>
      <KeyboardAwareScrollView
        style={{
          paddingTop: "20%",
          paddingHorizontal: "8%",
        }}
      >
        {posts ? (
          posts.length ? (
            posts.map((post) => (
              <MyPressable
                key={post.id}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  backgroundColor: "white",

                  ...shadow.md,

                  borderColor: colors.themeColor,
                  borderRadius: styles.borderRadius.md,
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => navigation.push("Post", { id: post.id })}
              >
                <View style={{ maxWidth: "75%" }}>
                  <BoldText
                    numberOfLines={1}
                    style={{
                      color: colors.themeColor,
                      fontSize: 14,
                      marginBottom: 7,
                    }}
                  >
                    {post.title}
                  </BoldText>
                  <BoldText
                    style={{ color: colors.mediumThemeColor, fontSize: 12 }}
                  >
                    {post.content.substring(0, 30) +
                      (post.content.length > 30 ? "..." : "")}
                  </BoldText>
                </View>
                <View
                  style={{
                    height: 40,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <BoldText
                      style={{
                        color: colors.mediumThemeColor,
                        fontSize: 11,
                        alignSelf: "flex-end",
                        marginRight: 4,
                      }}
                    >
                      @
                      {post.isAnonymous
                        ? ANONYMOUS_USERNAME
                        : post.createdBy?.netId}
                    </BoldText>
                    <View style={{ flexDirection: "row", width: 20 }}>
                      <Ionicons
                        style={{ marginRight: 3 }}
                        name="chatbox-outline"
                        color={colors.mediumThemeColor}
                        size={10}
                      />
                      <BoldText
                        style={{
                          color: colors.mediumThemeColor,
                          fontSize: 9,
                        }}
                      >
                        {post._count.comments}
                      </BoldText>
                    </View>
                  </View>

                  <BoldText
                    style={{
                      color: colors.lightThemeColor,
                      fontSize: 10,
                      alignSelf: "flex-end",
                    }}
                  >
                    {getTimeDifferenceString(post.createdAt)}
                  </BoldText>
                </View>
              </MyPressable>
            ))
          ) : (
            <BoldText style={{ color: colors.mediumThemeColor, fontSize: 20 }}>
              The board is empty.
            </BoldText>
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

export default BoardScreen;
