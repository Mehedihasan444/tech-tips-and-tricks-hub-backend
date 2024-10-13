"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const QueryBuilder_1 = require("../../builder/QueryBuilder");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.create(payload);
    return user;
});
const updateUserFollowListAndFollowersListInDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (payload.loggedInUserId) {
        const { loggedInUserId } = payload;
        // Convert userId and loggedInUserId to ObjectId
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const loggedInUserObjectId = new mongoose_1.default.Types.ObjectId(loggedInUserId);
        // Retrieve the user and logged-in user's data to check if they are already following
        const user = yield user_model_1.User.findById(userObjectId)
            .populate("followers")
            .populate("following");
        const loggedInUser = yield user_model_1.User.findById(loggedInUserObjectId)
            .populate("followers")
            .populate("following");
        if (!user || !loggedInUser) {
            throw new Error("User not found");
        }
        // Check if the loggedInUser is already in the followers list of user
        const isAlreadyFollowing = (_a = user.followers) === null || _a === void 0 ? void 0 : _a.some((follower) => follower._id.equals(loggedInUserObjectId));
        // If the user is already being followed, we will remove the loggedInUserId from the followers list
        // Otherwise, we will add the loggedInUserId to the followers list
        const userToUpdate = yield user_model_1.User.findByIdAndUpdate(userObjectId, isAlreadyFollowing
            ? { $pull: { followers: loggedInUserObjectId } } // Remove loggedInUserId from followers
            : { $addToSet: { followers: loggedInUserObjectId } }, // Add loggedInUserId to followers
        { new: true });
        // Similarly, check if userId is in the loggedInUser's following list
        const isUserInFollowingList = (_b = loggedInUser.following) === null || _b === void 0 ? void 0 : _b.some((follow) => follow._id.equals(userObjectId));
        // If already following, remove the userId from the following list
        // Otherwise, add userId to the following list
        const loggedInUserToUpdate = yield user_model_1.User.findByIdAndUpdate(loggedInUserObjectId, isUserInFollowingList
            ? { $pull: { following: userObjectId } } // Remove userId from following
            : { $addToSet: { following: userObjectId } }, // Add userId to following
        { new: true });
        return { userToUpdate, loggedInUserToUpdate };
    }
    else {
        const result = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
        return result;
    }
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = new QueryBuilder_1.QueryBuilder(user_model_1.User.find().populate("followers", "following"), query)
        .fields()
        .paginate()
        .sort()
        .filter()
        .search(user_constant_1.UserSearchableFields);
    const result = yield users.modelQuery;
    return result;
});
const getSingleUserFromDB = (nickName) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ nickName }).populate("followers", "following");
    return user;
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role === "ADMIN") {
        throw new Error("You can not delete an admin user");
    }
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    return result;
});
exports.UserServices = {
    createUser,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserFollowListAndFollowersListInDB,
    deleteUserFromDB,
};
