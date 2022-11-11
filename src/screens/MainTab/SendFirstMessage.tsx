import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { API_URL, colors } from "../../constants";
import { postData } from "../../util";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { ProgressContext } from "../../contexts/Progress";

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

  const { spinner } = useContext(ProgressContext);

  const sendFirstMessage = async () => {
    if (content.length >= 2) {
      spinner.start();
      const data = await postData(
        userContext,
        API_URL + "chat/createChatroom",
        {
          targetId,
          content,
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
              padding: 5,
            }}
            onPress={sendFirstMessage}
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
        justifyContent: "center",
        paddingHorizontal: "5%",
      }}
    >
      <BoldTextInput
        style={{
          backgroundColor: colors.lightThemeColor,
          width: "100%",
          minHeight: "20%",
        }}
        multiline={true}
        onChangeText={(text) => setContent(text.trim())}
      />
    </ScreenContainer>
  );
};

export default SendFirstMessage;
