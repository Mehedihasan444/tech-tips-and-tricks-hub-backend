import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';
import AppError from '../../errors/AppError';

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Created Successfully',
    data: user,
  });
});
const updateUserFollowListAndFollowersList = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id&&!req.body) {
    throw new AppError(400, "Something went wrong");
  }
  const updatedUser = await UserServices.updateUserFollowListAndFollowersListInDB(
    id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: updatedUser,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users Retrieved Successfully',
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.nickName);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User Retrieved Successfully',
    data: user,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});


export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  updateUserFollowListAndFollowersList,
  deleteUser
};