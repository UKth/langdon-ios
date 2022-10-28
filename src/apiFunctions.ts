import { Alert } from "react-native";
import { API_URL } from "./constants/urls";
import { postData } from "./util";

export const enrollClass = async (classId: number, accessToken: string) => {
  console.log("ENROLL CLASS TOKEN:", accessToken, "\n\n\n");
  const data = await postData(API_URL + "course/class/enrollClass", {
    classId,
    accessToken,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const dropClass = async (classId: number, accessToken: string) => {
  console.log("DROP CLASS TOKEN:", accessToken, "\n\n\n");
  const data = await postData(API_URL + "course/class/dropClass", {
    classId,
    accessToken,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
};

export const getEnrolledClasses = async (accessToken: string) => {
  const data = await postData(API_URL + "course/class/getEnrolledClasses", {
    accessToken,
  });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
  return data?.enrolledClasses;
};
