import { Board } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/urls";
import { postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";

const BoardScreen = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Board">;
}) => {
  const [posts, setPosts] = useState<Board[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const boardId = route.params.id;

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
    <KeyboardAwareScrollView
      style={{
        paddingTop: 100,
        display: "flex",
        marginBottom: 10,
      }}
    >
      <Pressable
        onPress={() => navigation.push("WritePost", { boardId })}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          {
            position: "absolute",
            right: 10,
            top: -30,
            borderRadius: 10,
            width: 35,
            height: 35,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="ios-create-outline" size={24} color="black" />
      </Pressable>
      <Text>board</Text>
      {posts?.map((post) => (
        <Pressable
          key={post.id}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
            },
            {
              borderBottomColor: "#505050",
              borderBottomWidth: 1,
              padding: 10,
              marginBottom: 5,
            },
          ]}
          onPress={() => navigation.push("Post", { id: post.id })}
        >
          <Text>{post.title}</Text>
        </Pressable>
      ))}
    </KeyboardAwareScrollView>
  );
};

export default BoardScreen;
