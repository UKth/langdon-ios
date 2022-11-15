import { UserWithCollege } from "@customTypes/models";
import React from "react";
import { View } from "react-native";
import { shadow } from "../../constants/styles";
import { colors, styles } from "../../constants";
import ProfileIcon from "./ProfileIcon";
import { BoldText } from "../StyledText";
import { getNameString } from "../../util";

const ProfileCard = ({ user }: { user: UserWithCollege }) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: styles.borderRadius.md,
        padding: 25,
        marginBottom: 50,
        ...shadow.md,
      }}
    >
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <ProfileIcon size={50} style={{ marginRight: 10 }} />
        <View style={{ paddingRight: 50 }}>
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              fontSize: 15,
              marginBottom: 5,
            }}
          >
            {getNameString(user)}
            <BoldText
              style={{
                color: colors.lightThemeColor,
                fontSize: 15,
              }}
            >
              {"  @"}
              {user.netId}
            </BoldText>
          </BoldText>
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              fontSize: 15,
            }}
          >
            {user.email}
          </BoldText>
        </View>
      </View>
      <BoldText
        style={{
          color: colors.mediumThemeColor,
          fontSize: 17,
        }}
      >
        {user.college.name}
      </BoldText>
    </View>
  );
};

export default ProfileCard;
