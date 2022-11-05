import { fullPost } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/urls";
import { postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { messages } from "../../constants/messages";

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
    if (comment.length > 3) {
      const data = await postData(
        userContext,
        API_URL + "board/comment/createComment",
        { postId, content: comment, isAnonymous }
      );
      if (!data?.ok) {
        Alert.alert(data?.error);
      } else {
        refresh();
      }
    } else {
      Alert.alert("Too short!");
    }
  };

  const deletePost = async () => {
    const data = await postData(
      userContext,
      API_URL + "board/post/deletePost",
      { postId }
    );

    if (!data?.ok) {
      Alert.alert(data?.error);
    } else {
      Alert.alert(messages.messages.post.postDeleted);
      navigation.pop();
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: 100,
        display: "flex",
        marginBottom: 10,
      }}
    >
      {post && userContext.user?.id === post.createdBy.id ? (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            {
              borderRadius: 10,
              width: 80,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={() => deletePost()}
        >
          <Ionicons name="trash" size={20} />
        </Pressable>
      ) : null}
      {post ? (
        <View>
          <Text>{post.isAnonymous ? "Anony" : post.createdBy.netId}</Text>
          <Text>{post.title}</Text>
          <Text>{post.content}</Text>
          <View style={{ borderWidth: 1, padding: 10 }}>
            {post.comments.map((comment) => (
              <View
                key={comment.id}
                style={{
                  borderWidth: 1,
                  borderRadius: 3,
                  marginBottom: 5,
                  height: 40,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>
                  {comment.isAnonymous ? "Anonymous" : comment.createdBy.netId}
                </Text>
                <Text>{comment.content}</Text>
              </View>
            ))}
          </View>
          <View style={{ padding: 10, flexDirection: "row" }}>
            <Checkbox
              value={isAnonymous}
              onValueChange={(newValue) => setIsAnonymous(newValue)}
            />
            <TextInput
              style={{
                flex: 1,
                backgroundColor: "#ffffff",
                fontSize: 18,
                marginBottom: 8,
                padding: 8,
                borderRadius: 4,
                marginRight: 10,
              }}
              placeholder="comment"
              placeholderTextColor={"#a0a0a0"}
              onChangeText={(text) => setComment(text.trim())}
            />
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                {
                  borderRadius: 10,
                  width: 80,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={createComment}
            >
              <Text>upload</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </KeyboardAwareScrollView>
  );
};

export default PostScreen;
