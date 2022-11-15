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
  firstName: string;
  middleName: string;
  lastName: string;
  collegeId: number;
  createdAt: Date;
  updatedAt: Date;
  defaultTableId: number;
};

export type UserWithCollege = User & {
  college: College;
};

export type ShortUser = {
  id: number;
  netId: string;
};

/**
 * Model Table
 *
 */
export type Table = {
  id: number;
  userId: number | null;
  termCode: number;
  title: string;
  collegeId: number;
  enrolledClasses: (ClassWithSections & { course: Course })[];
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
  enrollmentPrerequisites: string;
  minimumCredits: number;
  maximumCredits: number;
  title: string;
  collegeId: number;
};

export type CourseWithClasses = Course & { classes: ClassWithSections[] };

/**
 * Model Class
 *
 */
export type Class = {
  id: number;
  courseId: number;
};

export type ClassWithSections = Class & { sections: FullSection[] };

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

export type FullSection = Section & {
  instructor: Instructor;
  classMeetings: ClassMeetingWithBuilding[];
};

/**
 * Model ClassMeeting
 *
 */

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

export type ClassMeetingWithBuilding = ClassMeeting & { building: Building };

/**
 * Model Building
 *
 */
export type Building = {
  id: number;
  buildingCode: string;
  buildingName: string | null;
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
  isAnonymous: Boolean;
};

export type PostWithCounts = Post & {
  _count: {
    comments: number;
    likedUsers: number;
  };
  createdBy: ShortUser;
};

export type fullPost = PostWithCounts & {
  createdBy: User;
  comments: Comment[];
  likedUsers: User[];
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
  isAnonymous: Boolean;
  createdBy: User;
};

/**
 * Model Chatroom
 *
 */
export type Chatroom = {
  id: number;
  postId: number | null;
  isAnonymous: boolean;
  lastMessageId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TargetUser = {
  id: number;
  netId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
};

export type ChatroomForChatroomsList = Chatroom & {
  lastMessage: Message;
  members: TargetUser[];
  post: {
    title: string;
  };
};

export type FullChatroom = Chatroom & {
  members: TargetUser[];
  messages: Message[];
  post: Post; // TODO ?
};

/**
 * Model Message
 *
 */
export type Message = {
  id: number;
  chatroomId: number | null;
  user: ShortUser;
  userId: number;
  content: string;
  createdAt: Date;
};

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const BoardType = {
  course: "course",
  general: "general",
};

export type BoardType = typeof BoardType[keyof typeof BoardType];

export type Report = {
  id: number;
  content: string;
  userId: number;
  targetId: number;
  targetType: ReportTargetType;
};

export const ReportTargetType = {
  post: "post",
  user: "user",
  comment: "comment",
};

export type ReportTargetType =
  typeof ReportTargetType[keyof typeof ReportTargetType];
