import { QueryBuilder } from "../../builder/QueryBuilder";
import { UserSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

// const updateUserFollowListAndFollowersListInDB = async (userId: string, payload: { loggedInUserId: string }) => {
//   const { loggedInUserId } = payload;
//   // Add the loggedInUserId to the followersList of userId
//   const userToUpdate = await User.findByIdAndUpdate(
//     userId,
//     { $addToSet: { followers: loggedInUserId } },
//     { new: true }
//   );

//   // Add the userId to the followList of loggedInUserId
//   const loggedInUserToUpdate = await User.findByIdAndUpdate(
//     loggedInUserId,
//     { $addToSet: { following: userId } },
//     { new: true }
//   );

//   return { userToUpdate, loggedInUserToUpdate };
// };

const updateUserFollowListAndFollowersListInDB = async (
  userId: string,
  payload: { loggedInUserId: string }
) => {
  const { loggedInUserId } = payload;

  // Convert userId and loggedInUserId to ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);

  // Retrieve the user and logged-in user's data to check if they are already following
  const user = await User.findById(userObjectId)
    .populate("followers")
    .populate("following");
  const loggedInUser = await User.findById(loggedInUserObjectId)
    .populate("followers")
    .populate("following");

  if (!user || !loggedInUser) {
    throw new Error("User not found");
  }

  // Check if the loggedInUser is already in the followers list of user
  const isAlreadyFollowing = user.followers?.some((follower: any) =>
    follower._id.equals(loggedInUserObjectId)
  );

  // If the user is already being followed, we will remove the loggedInUserId from the followers list
  // Otherwise, we will add the loggedInUserId to the followers list
  const userToUpdate = await User.findByIdAndUpdate(
    userObjectId,
    isAlreadyFollowing
      ? { $pull: { followers: loggedInUserObjectId } } // Remove loggedInUserId from followers
      : { $addToSet: { followers: loggedInUserObjectId } }, // Add loggedInUserId to followers
    { new: true }
  );

  // Similarly, check if userId is in the loggedInUser's following list
  const isUserInFollowingList = loggedInUser.following?.some((follow: any) =>
    follow._id.equals(userObjectId)
  );

  // If already following, remove the userId from the following list
  // Otherwise, add userId to the following list
  const loggedInUserToUpdate = await User.findByIdAndUpdate(
    loggedInUserObjectId,
    isUserInFollowingList
      ? { $pull: { following: userObjectId } } // Remove userId from following
      : { $addToSet: { following: userObjectId } }, // Add userId to following
    { new: true }
  );

  return { userToUpdate, loggedInUserToUpdate };
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(
    User.find().populate("followers", "following"),
    query
  )
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;

  return result;
};

const getSingleUserFromDB = async (nickName: string) => {
  const user = await User.findOne({ nickName }).populate(
    "followers",
    "following"
  );

  return user;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFollowListAndFollowersListInDB,
};
