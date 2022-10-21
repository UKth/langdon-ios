import React, { useState, useEffect, useContext } from "react";

import { RouteProp, useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { getData, postData } from "../../util";
import { API_URL } from "../../constants/urls";
import { Alert } from "react-native";

const sendCode = async (email: string) => {
  const data = await postData(API_URL + "user/sendCode", { email });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
  return data;
};

const getTokens = async (registerData: {
  email: string;
  firstName?: string;
  lastName?: string;
  code: number;
  userId?: number;
}) => {
  const data = await postData(API_URL + "user/enter", registerData);
  if (!data?.ok) {
    Alert.alert(data?.error);
    return;
  }
  return data;
};

const Enter = ({
  route,
}: {
  route: RouteProp<AuthStackParamList, "Enter">;
}) => {
  const [backgroundIndex, setBackgroundIndex] = useState(-1);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const { college } = route.params;
  const [netId, setNetId] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState();

  return (
    <View style={{ paddingTop: 100, display: "flex", alignItems: "center" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#f0f0f0",
          borderWidth: 1,
          borderColor: "#808080",
          borderRadius: 4,
          padding: 5,
        }}
      >
        <TextInput
          style={{ width: 100 }}
          onChangeText={(text) => setNetId(text.trim())}
          autoCapitalize="none"
        />
        <Text style={{ fontSize: 18 }}>@{college.mailFooter}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          {
            marginTop: 30,
            padding: 10,
          },
        ]}
        onPress={async () => {
          if (netId.length) {
            const data = await sendCode(netId + "@" + college.mailFooter);
            if (data?.ok) {
              setCodeSent(true);
              if (data?.user) {
                setUserId(data.user.id);
              }
              Keyboard.dismiss();
            } else {
              Alert.alert(data.error);
            }
          }
        }}
      >
        <Text>Send Token</Text>
      </Pressable>
      {codeSent ? (
        <View style={{ marginTop: 40 }}>
          {!userId ? (
            <TextInput
              style={{
                width: 180,
                fontSize: 18,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#808080",
                padding: 8,
                borderRadius: 4,
              }}
              onChangeText={(text) => setFirstName(text.trim())}
              placeholder="first name"
            />
          ) : null}
          {!userId ? (
            <TextInput
              style={{
                width: 180,
                fontSize: 18,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#808080",
                padding: 8,
                borderRadius: 4,
              }}
              onChangeText={(text) => setLastName(text.trim())}
              placeholder="last name"
            />
          ) : null}
          <TextInput
            style={{
              width: 180,
              fontSize: 18,
              marginBottom: 8,
              borderWidth: 1,
              borderColor: "#808080",
              padding: 8,
              borderRadius: 4,
            }}
            onChangeText={(text) => setCode(text.trim())}
            keyboardType="number-pad"
            placeholder="Verification code"
          />
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
              },
              {
                marginTop: 30,
                padding: 10,
              },
            ]}
            onPress={async () => {
              if (netId.length) {
                const data = await getTokens({
                  email: netId + "@" + college.mailFooter,
                  code: +code,
                  ...(userId
                    ? {
                        userId,
                      }
                    : { firstName, lastName }),
                });
                if (data?.ok) {
                  console.log(data);
                } else {
                  Alert.alert(data.error);
                }
              }
            }}
          >
            <Text>{userId ? "Enter" : "Register"}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default Enter;
