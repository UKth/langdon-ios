export type College = {
  id: number;
  mailFooter: string;
  name: string;
  activated: boolean;
};

/**
 * Model User
 *
 */
export type User = {
  id: number;
  netId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  collegeId: number;
  college: College;
};

/**
 * Model Token
 *
 */
export type Token = {
  id: number;
  email: string;
  token: number;
  updatedAt: Date;
};

/**
 * Model Course
 *
 */
export type Course = {
  id: number;
  courseId: string;
  termCode: number;
  subjectCode: number;
  courseDesignation: string;
  courseDesignationCompressed: string;
  fullCourseDesignation: string;
  fullCourseDesignationCompressed: string;
  minimumCredits: number;
  maximumCredits: number;
  title: string;
  collegeId: number;
};

/**
 * Model Class
 *
 */
export type Class = {
  id: number;
  courseId: number;
};

/**
 * Model Section
 *
 */
export type Section = {
  id: number;
  type: string | null;
  sectionNumber: string | null;
  classId: number;
  instructorId: number | null;
};

/**
 * Model ClassMeeting
 *
 */

export const WI_GMT_DIFF = 1;

export type ClassMeeting = {
  id: number;
  meetingOrExamNumber: string;
  meetingType: string;
  meetingTimeStart: number | null;
  meetingTimeEnd: number | null;
  meetingDays: string | null;
  room: string | null;
  examDate: number | null;
  buildingId: number | null;
  sectionId: number;
};

/**
 * Model Building
 *
 */
export type Building = {
  id: number;
  buildingCode: string;
  buildingName: string;
  streetAddress: string | null;
  latitude: number | null;
  longitude: number | null;
};

/**
 * Model Instructor
 *
 */
export type Instructor = {
  id: number;
  netid: string;
  emplid: string;
  pvi: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  email: string | null;
};

/**
 * Model Board
 *
 */
export type Board = {
  id: number;
  title: string;
  type: BoardType;
  collegeId: number;
  userId: number | null;
  createdAt: Date;
};

/**
 * Model Post
 *
 */
export type Post = {
  id: number;
  boardId: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Model Comment
 *
 */
export type Comment = {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  postId: number;
};

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const BoardType = {
  class: "class",
  general: "general",
};

export type BoardType = typeof BoardType[keyof typeof BoardType];
