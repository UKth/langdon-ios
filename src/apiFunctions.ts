import { Alert } from "react-native";
import { API_URL } from "./constants/urls";
import { userContextType } from "./contexts/userContext";
import { postData } from "./util";

export const enrollClass = async (ctx: userContextType, classId: number) => {
  const data = await postData(ctx, API_URL + "course/class/enrollClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const dropClass = async (ctx: userContextType, classId: number) => {
  const data = await postData(ctx, API_URL + "course/class/dropClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const getEnrolledClasses = async (ctx: userContextType) => {
  const data = await postData(ctx, API_URL + "course/class/getEnrolledClasses");
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
  return data?.enrolledClasses;
};
