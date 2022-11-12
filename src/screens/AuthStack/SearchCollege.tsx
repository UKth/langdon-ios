import React, { useState, useEffect, useContext } from "react";

import { useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
// import { debounce, getData } from "@util";
import { debounce, getData } from "../../util";
import { API_URL, colors } from "../../constants";
import { College } from "../../types/models";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import styles, { shadow } from "../../constants/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const searchCollege = debounce(
  async (
    keyword: string,
    setSearchedCollege: React.Dispatch<
      React.SetStateAction<College[] | undefined>
    >
  ) => {
    if (keyword !== "") {
      const data = await getData(API_URL + "college/getCollege/" + keyword);
      if (data?.ok) {
        setSearchedCollege(data.collegeData);
      }
    }
  },
  220
);

const SearchCollege = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [keyword, setKeyword] = useState("");
  const [searchedCollege, setSearchedCollege] = useState<College[]>();

  useEffect(() => {
    if (keyword.length) {
      searchCollege(keyword, setSearchedCollege);
    } else {
      setSearchedCollege(undefined);
    }
  }, [keyword]);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: 30,
          paddingTop: "45%",
        }}
      >
        <BoldText
          style={{
            fontSize: 24,
            color: colors.mediumThemeColor,
            marginBottom: 1,
          }}
        >
          Welcome,
        </BoldText>
        <BoldText
          style={{
            fontSize: 24,
            color: colors.mediumThemeColor,
            marginBottom: "20%",
          }}
        >
          Search Your College
        </BoldText>
        <BoldTextInput
          style={{
            backgroundColor: "white",
            color: colors.mediumThemeColor,
            paddingHorizontal: 20,
            fontSize: 15,
            borderRadius: 50,
            height: 50,
            marginBottom: 15,
            ...shadow.md,
          }}
          onChangeText={(text) => setKeyword(text.trim())}
          placeholder="ex. University of Wisconsin - Madison"
          placeholderTextColor={colors.lightThemeColor}
        />
        {keyword.length ? (
          searchedCollege ? (
            searchedCollege.length ? (
              <View
                style={{
                  backgroundColor: "white",
                  paddingVertical: 20,
                  borderRadius: styles.borderRadius.large,

                  ...shadow.md,
                }}
              >
                {searchedCollege.map((college) => (
                  <MyPressable
                    key={college.id}
                    onPress={() => navigation.push("Enter", { college })}
                    style={{
                      paddingHorizontal: 20,
                    }}
                  >
                    <BoldText
                      style={{
                        fontSize: 17,
                        color: colors.mediumThemeColor,
                      }}
                    >
                      {college.name}
                    </BoldText>
                  </MyPressable>
                ))}
              </View>
            ) : (
              <View style={{ marginTop: "40%", alignItems: "center" }}>
                <BoldText
                  style={{
                    fontSize: 15,
                    color: colors.mediumThemeColor,
                    opacity: 0.8,
                  }}
                >
                  Can't find your college?
                </BoldText>
                <View style={{ flexDirection: "row" }}>
                  <MyPressable
                    onPress={() => navigation.push("RequestCollegeSupport")}
                  >
                    <BoldText
                      style={{
                        fontSize: 15,
                        color: colors.themeColor,
                      }}
                    >
                      Request your college
                    </BoldText>
                  </MyPressable>
                  <BoldText
                    style={{
                      fontSize: 15,
                      color: colors.mediumThemeColor,
                      opacity: 0.8,
                    }}
                  >
                    {" "}
                    to support
                  </BoldText>
                </View>
              </View>
            )
          ) : (
            <View style={{ paddingTop: 10 }}>
              <LoadingComponent />
            </View>
          )
        ) : null}
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default SearchCollege;
