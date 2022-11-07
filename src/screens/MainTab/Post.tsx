import { fullPost } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  ANONYMOUS_USERNAME,
  API_URL,
  colors,
  messages,
  styles,
} from "../../constants";
import { getTimeString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import Checkbox from "expo-checkbox";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { reportIssue } from "../../apiFunctions";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/Progress";
import { useRef } from "react";

const PostScreen = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Post">;
}) => {
  const [post, setPost] = useState<fullPost>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const [comment, setComment] = useState("");
  const postId = route.params.id;
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { spinner } = useContext(ProgressContext);
  const commentInputRef = useRef<any>();

  const refresh = async () => {
    const data = await postData(
      userContext,
      API_URL + "board/post/getPost/" + postId
    );
    if (data?.ok) {
      setPost(data.post);
    }
  };

  const createComment = async () => {
    if (comment.length < 3) {
      Alert.alert("Comment too short!");
    } else if (comment.length > 200) {
      Alert.alert("Comment too long!");
    } else {
      spinner.start();
      const data = await postData(
        userContext,
        API_URL + "board/comment/createComment",
        { postId, content: comment.trim(), isAnonymous }
      );
      spinner.stop();
      if (!data?.ok) {
        Alert.alert(data?.error);
      } else {
        setComment("");
        refresh();
      }
    }
  };

  const deletePost = async () => {
    spinner.start();
    const data = await postData(
      userContext,
      API_URL + "board/post/deletePost",
      { postId }
    );
    spinner.stop();

    if (!data?.ok) {
      Alert.alert(data?.error);
    } else {
      Alert.alert(messages.messages.post.postDeleted);
      navigation.pop();
    }
  };

  const deleteComment = async (commentId: number) => {
    spinner.start();
    const data = await postData(
      userContext,
      API_URL + "board/comment/deleteComment",
      { commentId }
    );
    spinner.stop();

    if (!data?.ok) {
      Alert.alert(data?.error);
    } else {
      Alert.alert(messages.messages.comment.commentDeleted);
      refresh();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const isMine = post?.userId === userContext.user?.id;
        if (!post || !userContext.user) {
          return null;
        }
        return (
          <MyPressable
            onPress={
              isMine
                ? () =>
                    Alert.alert(
                      "Delete post",
                      "Are you sure to delete this post?",
                      [
                        {
                          text: "Yes",
                          onPress: deletePost,
                        },
                        {
                          text: "cancel",
                          style: "cancel",
                        },
                      ]
                    )
                : onPressMenu
            }
          >
            <Ionicons
              name={isMine ? "trash" : "menu"}
              size={isMine ? 20 : 22}
            />
          </MyPressable>
        );
      },
    });
    refresh();
  }, [post, userContext]);

  const onPressMenu = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Report the post"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        // userInterfaceStyle: 'dark',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          reportIssue(userContext, {
            content: "post report",
            targetId: post?.id ?? 0,
            targetType: "post",
          });
        }
      }
    );

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={90}
        style={{ backgroundColor: "white", flex: 1 }}
      >
        <ScrollView
          style={{
            paddingTop: "10%",
            paddingHorizontal: "8%",
          }}
        >
          {post ? (
            <View style={{ marginBottom: 40 }}>
              <BoldText
                style={{
                  fontSize: 20,
                  color: colors.themeColor,
                  marginBottom: 2,
                }}
              >
                {post.title}
              </BoldText>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <BoldText
                  style={{
                    fontSize: 13,
                    color: colors.lightThemeColor,
                    marginBottom: 10,
                  }}
                >
                  {getTimeString(new Date(post.createdAt))}
                </BoldText>
                <BoldText
                  style={{
                    fontSize: 15,
                    color: colors.mediumThemeColor,
                    marginBottom: "10%",
                  }}
                >
                  @
                  {post.isAnonymous ? ANONYMOUS_USERNAME : post.createdBy.netId}
                </BoldText>
              </View>
              <BoldText
                style={{
                  fontSize: 15,
                  color: colors.mediumThemeColor,
                  minHeight: 150,
                  marginBottom: "3%",
                }}
              >
                {post.content}
              </BoldText>
              <View
                style={{
                  borderTopWidth: 1,
                  paddingHorizontal: 5,
                  borderColor: colors.lightThemeColor,
                  paddingTop: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    style={{ marginTop: 2, marginRight: 3 }}
                    name="chatbox-outline"
                    color={colors.mediumThemeColor}
                    size={12}
                  />
                  <BoldText
                    style={{
                      marginTop: 1,
                      color: colors.mediumThemeColor,
                      fontSize: 12,
                    }}
                  >
                    {post._count.comments}
                  </BoldText>
                </View>
                {post.comments.map((comment) => (
                  <View
                    key={comment.id}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",

                      shadowOffset: { width: 0, height: 1 },
                      shadowRadius: 2,
                      shadowColor: `rgba(0,0,0,0.1)`,
                      shadowOpacity: 1,
                      backgroundColor: "white",

                      borderRadius: styles.borderRadius.sm,
                      paddingHorizontal: 10,
                      paddingVertical: 7,
                      marginBottom: 7,
                    }}
                  >
                    <View style={{ width: "90%" }}>
                      <BoldText
                        style={{
                          fontSize: 13,
                          color: colors.themeColor,

                          marginBottom: 5,
                        }}
                      >
                        @
                        {comment.isAnonymous
                          ? ANONYMOUS_USERNAME
                          : comment.createdBy.netId}
                      </BoldText>
                      <BoldText
                        style={{
                          color: colors.mediumThemeColor,
                          fontSize: 11,
                        }}
                      >
                        {comment.content}
                      </BoldText>
                    </View>
                    <MyPressable
                      onPress={() => {
                        const isMine = comment.userId === userContext.user?.id;
                        ActionSheetIOS.showActionSheetWithOptions(
                          {
                            options: [
                              "Cancel",
                              isMine
                                ? "Delete the comment"
                                : "Report the comment",
                            ],
                            destructiveButtonIndex: 1,
                            cancelButtonIndex: 0,
                            // userInterfaceStyle: 'dark',
                          },
                          (buttonIndex) => {
                            if (buttonIndex === 0) {
                              // cancel action
                            } else if (buttonIndex === 1) {
                              if (isMine) {
                                Alert.alert(
                                  "Delete post",
                                  "Are you sure to delete this post?",
                                  [
                                    {
                                      text: "Yes",
                                      onPress: () => deleteComment(comment.id),
                                    },
                                    {
                                      text: "cancel",
                                      style: "cancel",
                                    },
                                  ]
                                );
                              } else {
                                reportIssue(userContext, {
                                  content: "comment report",
                                  targetId: comment.id,
                                  targetType: "comment",
                                });
                              }
                            }
                          }
                        );
                      }}
                    >
                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={24}
                        color={colors.mediumThemeColor}
                      />
                    </MyPressable>
                  </View>
                ))}
              </View>
            </View>
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
        </ScrollView>

        <View
          style={{
            paddingLeft: 20,
            paddingRight: 10,
            paddingVertical: 10,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.lightThemeColor,
            marginHorizontal: 10,
            marginBottom: 5,

            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            shadowColor: `rgba(0,0,0,0.1)`,
            shadowOpacity: 1,
          }}
        >
          <Checkbox
            value={isAnonymous}
            onValueChange={(newValue) => setIsAnonymous(newValue)}
            color={colors.mediumThemeColor}
            style={{ width: 15, height: 15, marginRight: 5 }}
          />
          <BoldText>Anon.</BoldText>
          <BoldTextInput
            style={{
              flex: 1,
              color: "white",
              fontSize: 18,
              padding: 8,
              borderRadius: 4,
              marginRight: 10,
            }}
            placeholder="comment"
            placeholderTextColor={colors.placeHolerTextColor}
            value={comment}
            multiline={true}
            maxLength={200}
            onChangeText={(text) => setComment(text)}
          />
          <MyPressable
            style={{
              borderLeftWidth: 1,
              borderColor: "white",
              width: 80,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={createComment}
          >
            <BoldText style={{ fontSize: 16 }}>upload</BoldText>
          </MyPressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default PostScreen;
