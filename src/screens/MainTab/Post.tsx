import { Comment, FullPost } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import {
  ActionSheetIOS,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { ANONYMOUS_USERNAME, API_URL, colors, messages } from "../../constants";
import { getTimeString, loadData, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import {
  CommentComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { reportIssue } from "../../apiFunctions";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { ProgressContext } from "../../contexts/progressContext";
import { useRef } from "react";
import { shadow } from "../../constants/styles";

const PostScreen = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Post">;
}) => {
  const [post, setPost] = useState<FullPost>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const [comment, setComment] = useState("");
  const postId = route.params.id;
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { spinner } = useContext(ProgressContext);
  const commentInputRef = useRef<any>();
  const [isLiked, setIsLiked] = useState(false);

  const fetch = async (lastCommentId?: number) => {
    const data = await postData(
      userContext,
      API_URL + "board/post/getPost/" + postId,
      {
        lastCommentId,
      }
    );

    if (data?.ok && data.post) {
      if (post && data.lastCommentId) {
        loadData({
          data: post.comments,
          setData: (newComments: Comment[]) =>
            setPost({
              ...data.post,
              comments: newComments ?? [],
            }),
          loadedData: data.post.comments,
          lastId: data.lastCommentId,
        });
      } else {
        setPost(data.post);
      }
      setIsLiked(data.post.isLiked);
    } else {
      Alert.alert(data?.error ?? "Failed to load posts.");
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
        Alert.alert("Failed to create comment.\n" + data?.error);
      } else {
        setComment("");
        fetch();
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
      Alert.alert("Failed to delete post.\n" + data?.error);
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
      Alert.alert("Failed to delete comment.\n" + data?.error);
    } else {
      Alert.alert(messages.messages.comment.commentDeleted);
      fetch();
    }
  };

  const pressLike = async (like: boolean) => {
    if (post) {
      spinner.start();
      const data = await postData(
        userContext,
        API_URL + "board/post/" + (like ? "likePost" : "unlikePost"),
        {
          postId: post.id,
        }
      );
      spinner.stop();
      if (data?.ok) {
        if (data.count?.likedUser !== undefined) {
          setPost({
            ...post,
            _count: {
              ...post._count,
              likedUsers: data.count.likedUser,
            },
            isLiked: like,
          });
        }
      } else {
        Alert.alert(data.error ?? (like ? "Like failed." : "Unlike failed"));
        setIsLiked(!like);
      }
    }
  };

  useEffect(() => {
    fetch();
  }, []);

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
  }, [post, userContext]);

  const onPressMenu = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Report the post", "Send message to writer."],
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
        } else if (buttonIndex === 2 && post?.createdBy.id) {
          if (post?.createdBy.id) {
            navigation.push("SendFirstMessage", {
              targetId: post.createdBy.id,
              postId: post.id,
            });
          } else {
            Alert.alert("Something's wrong. Please try again."); // TODO
          }
        }
      }
    );

  const PostContentComponent = ({ post }: { post: FullPost }) => (
    <View>
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
          {getTimeString(post.createdAt)}
        </BoldText>
        <BoldText
          style={{
            fontSize: 15,
            color: colors.mediumThemeColor,
            marginBottom: "10%",
          }}
        >
          @{post.isAnonymous ? ANONYMOUS_USERNAME : post.createdBy.netId}
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
          <View style={{ flexDirection: "row", marginRight: 3 }}>
            <Ionicons
              style={{ marginTop: 2, marginRight: 3 }}
              name="chatbox-outline"
              color={colors.mediumThemeColor}
              size={14}
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

          <MyPressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ flexDirection: "row" }}
            onPress={() => {
              pressLike(!isLiked);
              setIsLiked(!isLiked);
            }}
          >
            <Ionicons
              style={{ marginTop: 2, marginRight: 3 }}
              name={isLiked ? "heart" : "heart-outline"}
              color={colors.mediumThemeColor}
              size={14}
            />
            <BoldText
              style={{
                marginTop: 1,
                color: colors.mediumThemeColor,
                fontSize: 12,
              }}
            >
              {post._count.likedUsers + +(!post.isLiked && isLiked)}
            </BoldText>
          </MyPressable>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={90}
        style={{ backgroundColor: "white", flex: 1 }}
      >
        {post ? (
          <FlatList
            style={{
              paddingTop: "10%",
              paddingHorizontal: "8%",
            }}
            ListHeaderComponent={() => <PostContentComponent post={post} />}
            ListFooterComponent={() => <View style={{ height: 45 }} />}
            data={post.comments}
            renderItem={({ item: comment }) => (
              <CommentComponent
                key={comment.id}
                comment={comment}
                deleteComment={deleteComment}
                post={post}
              />
            )}
            keyExtractor={(comment) => comment.id + ""}
            onEndReached={() =>
              fetch(post.comments[post.comments.length - 1].id)
            }
            onEndReachedThreshold={0.5}
          />
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
        {post ? (
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

              ...shadow.md,
            }}
          >
            <Checkbox
              hitSlop={{
                top: 10,
                bottom: 10,
                right: 10,
                left: 10,
              }}
              value={isAnonymous}
              onValueChange={(newValue) => setIsAnonymous(newValue)}
              color={colors.mediumThemeColor}
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
            <BoldText style={{ color: colors.mediumThemeColor }}>
              Anon.
            </BoldText>
            <BoldTextInput
              style={{
                flex: 1,
                color: colors.mediumThemeColor,
                fontSize: 18,
                padding: 8,
                borderRadius: 4,
                marginRight: 10,
              }}
              placeholder="comment"
              placeholderTextColor={colors.lightThemeColor}
              value={comment}
              multiline={true}
              maxLength={200}
              onChangeText={(text) => setComment(text)}
            />
            <MyPressable
              style={{
                borderLeftWidth: 1,
                borderColor: colors.lightThemeColor,
                width: 80,
                height: 35,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={createComment}
            >
              <BoldText
                style={{ color: colors.mediumThemeColor, fontSize: 16 }}
              >
                upload
              </BoldText>
            </MyPressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default PostScreen;
