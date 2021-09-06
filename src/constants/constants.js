import { exp } from "react-native-reanimated";

export const HTTP_SHCEM = "http://";
// export const SERVER_DOMAIN =  "10.10.10.22:4200";
export const SERVER_DOMAIN =  "ec2-3-16-158-115.us-east-2.compute.amazonaws.com:4200";
export const API_SHEME = "/api";
export const BASE_URL = HTTP_SHCEM + SERVER_DOMAIN + API_SHEME;

export const LOGIN_URL = BASE_URL + "/login";
export const SIGNUP_URL = BASE_URL + "/signup";
export const FORGOT_PWD = BASE_URL + "/forgot-password";

export const DELETE_PROFILE_IMAGE = BASE_URL + "/deleteProfileImage";
export const UPDATE_PROFILE_URL = BASE_URL + "/updateProfile";
export const PROFILE_IMAGE_UPLOAD_URL = BASE_URL + "/updateProfileImage";
export const PUBLIC_FOLDER = HTTP_SHCEM + SERVER_DOMAIN + '/users_image/thumb/';
export const GET_ALL_EVENTS = BASE_URL + '/get_events';

export const GET_ALL_MUSICS = BASE_URL + "/get_musics";
export const GET_ALL_INTERVIEWS = BASE_URL + "/get_interviews";
export const GET_ALL_LL2 = BASE_URL + "/get_ll2";
