import { Alert } from "react-native";
import { API_URL } from "./constants/urls";
import { postData } from "./util";

export const enrollClass = async (classId: number) => {
  const data = await postData(API_URL + "course/class/enrollClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const dropClass = async (classId: number) => {
  const data = await postData(API_URL + "course/class/dropClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const getEnrolledClasses = async () => {
  const data = await postData(API_URL + "course/class/getEnrolledClasses");
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
  return data?.enrolledClasses;
};
