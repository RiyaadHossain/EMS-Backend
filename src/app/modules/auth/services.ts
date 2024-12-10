import ApiError from "@/errors/ApiError";
import { IUserCredential } from "./interface";
import httpStatus from "http-status";
import { jwtHelpers } from "@/helpers/jwtHelpers";
import config from "@/config";
import { Secret } from "jsonwebtoken";
import User from "../user/model";
import { ENUM_USER_ROLE } from "@/enums/user";
import Company from "../company/model";
import { ENUM_COMPANY_STATUS } from "@/enums/company";

const login = async (payload: IUserCredential) => { 
  const { userId, password } = payload;

  // Check User Existence
  const userExist = await User.findOne({ userId }).select('+password');
  if (!userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");
  }

  // Check Password
  const isPassMatched = await User.isPasswordMatched(
    password,
    userExist.password
  );
  if (!isPassMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  const { role, _id} = userExist;

  if (role == ENUM_USER_ROLE.ADMIN) {
    await Company.findOneAndUpdate({admin: _id}, {status: ENUM_COMPANY_STATUS.ACTIVE})
  }

  // Generate Tokens
  const accessToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.SECRET as Secret,
    config.JWT.SECRET_EXPIRE as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { userId, role },
    config.JWT.REFRESH as Secret,
    config.JWT.REFRESH_EXPIRE as string
  );

  return { accessToken, refreshToken };
};


export const AuthServices = {
     login
  };
  