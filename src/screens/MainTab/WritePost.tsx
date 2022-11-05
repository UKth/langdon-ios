import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert, Pressable, Text, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL } from "../../constants/urls";
import { postData } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import Checkbox from "expo-checkbox";

const WritePost = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "WritePost">;
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const boardId = route.params.boardId;

  return (
    <KeyboardAwareScrollView
      style={{
        paddingTop: 70,
        display: "flex",
        marginBottom: 10,
        paddingHorizontal: 20,
      }}
    >
      <Pressable
        onPress={async () => {
          if (title.length > 3 && content.length > 3) {
            const data = await postData(
              userContext,
              API_URL + "board/post/createPost",
              {
                boardId,
                content,
                title,
                isAnonymous,
              }
            );
            if (data?.ok) {
              navigation.pop();
            } else {
              Alert.alert(data?.error);
            }
          } else {
            Alert.alert("Too short!");
          }
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          {
            position: "absolute",
            right: 10,
            top: -50,
            borderRadius: 5,
            padding: 10,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Text>Upload</Text>
      </Pressable>
      <Checkbox
        value={isAnonymous}
        onValueChange={(newValue) => setIsAnonymous(newValue)}
      />
      <TextInput
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          fontSize: 18,
          marginBottom: 8,
          padding: 8,
          borderRadius: 4,
        }}
        placeholder="title"
        placeholderTextColor={"#a0a0a0"}
        onChangeText={(text) => setTitle(text.trim())}
      />
      <TextInput
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          fontSize: 18,
          marginBottom: 8,
          padding: 8,
          borderRadius: 4,
          height: 100,
        }}
        multiline={true}
        placeholder="content"
        placeholderTextColor={"#a0a0a0"}
        onChangeText={(text) => setContent(text.trim())}
      />
    </KeyboardAwareScrollView>
  );
};

export default WritePost;
