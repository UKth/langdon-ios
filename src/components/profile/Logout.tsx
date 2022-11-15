import React, { useContext } from "react";
import { colors } from "../../constants";
import { shadow } from "../../constants/styles";
import { UserContext } from "../../contexts/userContext";
import { logout } from "../../util";
import { MyPressable } from "../shared";
import { BoldText } from "../StyledText";
const Logout = () => {
  const userContext = useContext(UserContext);
  return (
    <MyPressable
      style={{
        padding: 10,
        borderRadius: 20,
        backgroundColor: colors.lightThemeColor,
        width: "30%",
        alignSelf: "center",
        alignItems: "center",

        ...shadow.md,
      }}
      onPress={() => logout(userContext)}
    >
      <BoldText style={{ color: "white" }}>logout</BoldText>
    </MyPressable>
  );
};

export default Logout;
