import { TermCode, TermCodeType } from "@customTypes/models";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { colors, styles, termNames, terms } from "../../constants";

import { MyPressable } from "../shared";
import { BoldText } from "../StyledText";

const DropDownTermPicker = ({
  termCode,
  setTermCode,
  style,
}: {
  termCode: TermCodeType;
  setTermCode: React.Dispatch<React.SetStateAction<TermCodeType>>;
  style?: ViewStyle;
}) => {
  const [showDropDown, setShowDropDown] = useState(false);
  return (
    <View
      style={[
        {
          borderRadius: styles.borderRadius.xs,
        },
        style,
      ]}
    >
      <MyPressable
        style={{
          borderRadius: styles.borderRadius.xs,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.1)",
          backgroundColor: "white",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingVertical: 8,
          alignItems: "center",
        }}
        onPress={() => setShowDropDown(!showDropDown)}
      >
        <BoldText style={{ fontSize: 16, color: colors.mediumThemeColor }}>
          {termNames[termCode]}
        </BoldText>
        <Ionicons
          name={showDropDown ? "chevron-up" : "chevron-down"}
          color={colors.mediumThemeColor}
          size={22}
        />
      </MyPressable>
      {showDropDown && (
        <View
          style={{
            borderWidth: 1,
            borderTopWidth: 0,
            borderColor: "rgba(0,0,0,0.1)",
          }}
        >
          {terms.map((term, index) => (
            <MyPressable
              style={{
                paddingHorizontal: 15,
                paddingVertical: 7,
              }}
              onPress={() => {
                setTermCode(term.code);
                setShowDropDown(false);
              }}
            >
              <BoldText
                style={{
                  fontSize: 15,
                  color: colors.lightThemeColor,

                  borderTopWidth: 1,
                  borderTopColor: "#129301",
                  borderBottomWidth: 1,
                }}
              >
                {term.name}
              </BoldText>
            </MyPressable>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropDownTermPicker;
