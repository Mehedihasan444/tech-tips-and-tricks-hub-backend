/* eslint-disable no-unused-vars */
import { Model, ObjectId } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant";
type IEducation = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
};
type ISocialMedia = {
  platform: string;
  url: string;
};
export type TUser = {
  _id?: string;
  name: string;
  role: keyof typeof USER_ROLE;
  email: string;
  password: string;
  status: keyof typeof USER_STATUS;
  passwordChangedAt?: Date;
  mobileNumber?: string;
  profilePhoto?: string;
  createdAt?: Date;
  updatedAt?: Date;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  education?: IEducation[];
  socialMedia?: ISocialMedia[];
  shortBio?: string;
  nickName: string;
  followers?: ObjectId[];
  following?: ObjectId[];
};

export interface IUserModel extends Model<TUser> {
  isUserExistsByEmail(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
}
