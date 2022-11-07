import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { API_URL, colors } from "../../constants";
import { postData } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import Checkbox from "expo-checkbox";
import { MyPressable, ScreenContainer } from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/Progress";
import { shadow } from "../../constants/styles";

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
  const { spinner } = useContext(ProgressContext);

  const onSubmit = async () => {
    if (content.length > 1000 || title.length > 200) {
      Alert.alert("A title or conent is too long.");
    } else if (title.length < 4 || content.length < 4) {
      Alert.alert("A title or conent is too short.");
    } else {
      spinner.start();
      const data = await postData(
        userContext,
        API_URL + "board/post/createPost",
        {
          boardId,
          content: content.trim(),
          title,
          isAnonymous,
        }
      );
      spinner.stop();
      if (data?.ok) {
        navigation.pop();
      } else {
        Alert.alert(data?.error);
      }
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyPressable
          onPress={() =>
            Alert.alert("Upload post", "Are you sure to upload this post?", [
              {
                text: "Yes",
                onPress: onSubmit,
              },
              {
                text: "cancel",
                style: "cancel",
              },
            ])
          }
        >
          <BoldText style={{ color: colors.mediumThemeColor }}>Upload</BoldText>
        </MyPressable>
      ),
    });
  }, [title, content]);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        style={{
          paddingTop: 70,
          display: "flex",
          marginBottom: 10,
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", marginBottom: "5%" }}>
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
          <BoldText style={{ color: colors.mediumThemeColor }}>Anon.</BoldText>
        </View>
        <BoldTextInput
          style={{
            width: "100%",
            backgroundColor: colors.lightThemeColor,
            fontSize: 18,
            marginBottom: "5%",
            padding: 10,
            borderRadius: 4,
            color: "white",
            ...shadow.md,
          }}
          placeholder="title"
          multiline={true}
          maxLength={200}
          placeholderTextColor={colors.placeHolerTextColor}
          onChangeText={(text) => {
            setTitle(text.trim());
          }}
        />
        <View style={{ marginBottom: "10%" }}>
          <BoldTextInput
            style={{
              width: "100%",
              backgroundColor: colors.lightThemeColor,
              fontSize: 18,
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
              minHeight: 200,
              color: "white",
              paddingBottom: 25,
              ...shadow.md,
            }}
            multiline={true}
            placeholder="content"
            placeholderTextColor={colors.placeHolerTextColor}
            maxLength={1000}
            onChangeText={(text) => {
              if (text.length <= 1000) {
                setContent(text);
              }
            }}
          />
          <BoldText style={{ position: "absolute", right: 15, bottom: 15 }}>
            {content.length} / 1000
          </BoldText>
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default WritePost;
