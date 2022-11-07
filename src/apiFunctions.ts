import { ReportTargetType } from "@customTypes/models";
import { Alert } from "react-native";
import { API_URL, messages } from "./constants";
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
    return [];
  }
  return data?.enrolledClasses;
};

export const reportIssue = async (
  ctx: userContextType,
  params: {
    content: string;
    targetId: number;
    targetType: ReportTargetType;
  }
) => {
  const data = await postData(ctx, API_URL + "report/createReport", params);
  if (!data?.ok) {
    Alert.alert(data?.error);
    return;
  }
  Alert.alert(messages.messages.report.reportCreated);
};
