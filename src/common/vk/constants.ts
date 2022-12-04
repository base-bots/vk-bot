import { API, Upload } from "vk-io";
import { config } from "../../config";

export const VK_API = new API({
  token: config.token,
});

export const UPLOAD = new Upload({
  api: VK_API,
});
