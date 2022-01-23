import configs from "../../app.config";

export const jwtConstants = {
  secret: configs.jwtToken, //Please don't make this public
};
