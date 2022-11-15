import { Table, TermCode, TermCodeType, User } from "@customTypes/models";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  API_URL,
  colors,
  CURRENT_TERMCODE,
  termNames,
  WEB_URL,
} from "../../constants";
import { getNameString, postData } from "../../util";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import {
  DropDownTermPicker,
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Share,
  View,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles, { shadow } from "../../constants/styles";
import { ProgressContext } from "../../contexts/progressContext";
import { Picker } from "@react-native-picker/picker";

const Tables = () => {
  const [tables, setTables] = useState<Table[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const user = userContext.user;
  const [code, setCode] = useState();
  const { spinner } = useContext(ProgressContext);
  const [showCreater, setShowCreater] = useState(false);
  const [selectedTerm, setSelectedTerm] =
    useState<TermCodeType>(CURRENT_TERMCODE);
  const [title, setTitle] = useState("");

  if (!user) {
    return <ErrorComponent />;
  }

  const createTable = async (termCode: TermCodeType, title: string) => {
    spinner.start();
    const data = await postData(userContext, API_URL + "table/createTable", {
      termCode,
      title: title.trim(),
    });
    spinner.stop();
    setShowCreater(false);
    if (data?.ok) {
      updateTables();
    } else {
      Alert.alert(data.error ?? "Failed to create table");
    }
  };

  const updateTables = async () => {
    const data = await postData(userContext, API_URL + "table/getTables");
    console.log(data);
    if (data?.ok && data.tables) {
      setTables(data.tables);
    }
  };

  useEffect(() => {
    updateTables();
  }, []);

  useEffect(() => {
    setTitle(termNames[selectedTerm]);
  }, [selectedTerm]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={"padding"}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={{
            paddingTop: "10%",
            paddingHorizontal: "8%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: 20,
              paddingHorizontal: 10,
            }}
          >
            {tables ? (
              <MyPressable
                style={{
                  borderRadius: 30,
                  padding: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  ...shadow.md,
                }}
                onPress={() => setShowCreater(!showCreater)}
              >
                <View
                  style={{
                    position: "absolute",
                    width: 15,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: colors.themeColor,
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    width: 2,
                    height: 15,
                    borderRadius: 2,
                    backgroundColor: colors.mediumThemeColor,
                  }}
                />
              </MyPressable>
            ) : null}
          </View>
          {tables ? (
            tables?.length ? (
              tables.map((table) => (
                <MyPressable
                  key={table.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    marginBottom: 10,
                    ...shadow.md,
                    borderRadius: styles.borderRadius.md,
                  }}
                  onPress={() =>
                    navigation.push("TimeTable", {
                      tableId: table.id,
                    })
                  }
                >
                  <BoldText
                    style={{ fontSize: 15, color: colors.mediumThemeColor }}
                  >
                    {table.title}
                  </BoldText>
                  {user.defaultTableId === table.id ? (
                    <MaterialIcons
                      name="online-prediction"
                      size={20}
                      color={colors.mediumThemeColor}
                    />
                  ) : null}
                </MyPressable>
              ))
            ) : (
              <ErrorComponent />
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
        </ScrollView>
        {showCreater ? (
          <Pressable
            style={{
              position: "absolute",
              zIndex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShowCreater(false)}
          >
            <View
              style={{
                backgroundColor: "black",
                opacity: 0.3,
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
            />
            <View style={{ width: "100%", paddingHorizontal: 40 }}>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  ...shadow.hard,
                  borderRadius: styles.borderRadius.sm,
                  padding: 20,
                }}
              >
                <BoldText
                  style={{
                    fontSize: 16,
                    color: colors.mediumThemeColor,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                >
                  New table
                </BoldText>
                <BoldText
                  style={{
                    fontSize: 15,
                    color: colors.mediumThemeColor,
                    marginBottom: 5,
                    marginLeft: 5,
                  }}
                >
                  Select the term
                </BoldText>
                <DropDownTermPicker
                  termCode={selectedTerm}
                  setTermCode={setSelectedTerm}
                  style={{ marginBottom: 15 }}
                />
                <BoldText
                  style={{
                    fontSize: 15,
                    color: colors.mediumThemeColor,
                    marginBottom: 5,
                    marginLeft: 5,
                  }}
                >
                  Enter table title
                </BoldText>
                <BoldTextInput
                  style={{
                    backgroundColor: "white",
                    color: colors.mediumThemeColor,
                    paddingHorizontal: 20,
                    fontSize: 15,
                    borderRadius: styles.borderRadius.sm,
                    borderWidth: 1,
                    borderColor: "rgba(0,0,0,0.1)",
                    height: 50,
                    marginBottom: 15,
                  }}
                  placeholder="Table title"
                  placeholderTextColor={colors.lightThemeColor}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  maxLength={50}
                />
                <MyPressable
                  style={{
                    backgroundColor: colors.lightThemeColor,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 12,
                    borderRadius: styles.borderRadius.sm,
                  }}
                  onPress={() => {
                    createTable(selectedTerm, title);
                    setTitle("");
                  }}
                >
                  <BoldText style={{ color: "white" }}>Create</BoldText>
                </MyPressable>
              </View>
            </View>
          </Pressable>
        ) : null}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

export default Tables;
