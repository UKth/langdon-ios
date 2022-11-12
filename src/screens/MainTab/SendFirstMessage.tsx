import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext, useRef } from "react";
import { ActivityIndicator, Alert, TextInput, View } from "react-native";
import { API_URL, colors } from "../../constants";
import { postData } from "../../util";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
  Spinner,
} from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { ProgressContext } from "../../contexts/progressContext";

const SendFirstMessage = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "SendFirstMessage">;
}) => {
  const userContext = useContext(UserContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const { targetId, postId } = route.params;
  const [content, setContent] = useState("");
  const textInputRef = useRef<TextInput>();

  const { inProgress, spinner } = useContext(ProgressContext);

  const sendFirstMessage = async (text: string) => {
    if (content.length >= 2) {
      spinner.start();
      const data = await postData(
        userContext,
        API_URL + "chat/createChatroom",
        {
          targetId,
          content: text,
          ...(postId ? { postId } : {}),
        }
      );
      spinner.stop();
      if (data?.ok) {
        navigation.pop();
        Alert.alert("Message sent.");
      } else {
        Alert.alert(data?.error ?? "Failed to send message.");
      }
    } else {
      Alert.alert("The message is too short.");
    }
  };

  useEffect(() => {
    if (content.length >= 2) {
      navigation.setOptions({
        headerRight: () => (
          <MyPressable
            style={{
              backgroundColor: colors.mediumThemeColor,
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            onPress={() => sendFirstMessage(content.trim())}
          >
            <BoldText>Send</BoldText>
          </MyPressable>
        ),
      });
    }
  }, [content]);

  return (
    <ScreenContainer
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          paddingHorizontal: "5%",
          width: "100%",
        }}
      >
        <BoldTextInput
          autoFocus={true}
          style={{
            width: "100%",
            minHeight: "20%",
            fontSize: 18,
            color: colors.mediumThemeColor,
          }}
          multiline={true}
          onChangeText={(text) => setContent(text)}
        />
      </View>
      {inProgress && (
        <ActivityIndicator size={"large"} color={colors.lightThemeColor} />
      )}
    </ScreenContainer>
  );
};

export default SendFirstMessage;
