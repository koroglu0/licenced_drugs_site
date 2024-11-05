const registerService = require("./services/register");
const loginService = require("./services/login");
const verifyService = require("./services/verify");
const util = require("./utils/util");
const drugsService = require("./services/drugs");

const registerPath = "/register";
const loginPath = "/login";
const verifyPath = "/verify";
const drugsPath = "/drugs";
const healthpath = "/health";

exports.handler = async (event) => {
  console.log("Request Event : ", event);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthpath:
      response = await util.buildResponse(200, "Başarılı!");
      break;
    case event.httpMethod === "POST" && event.path === registerPath:
      const registerBody = JSON.parse(event.body);
      response = await registerService.register(registerBody);
      break;
    case event.httpMethod === "POST" && event.path === loginPath:
      const loginBody = JSON.parse(event.body);
      response = await loginService.login(loginBody);
      break;
    case event.httpMethod === "POST" && event.path === verifyPath:
      const verifyBody = JSON.parse(event.body);
      response = verifyService.verify(verifyBody);
      break;
    case event.httpMethod === "GET" && event.path === drugsPath:
      let drugsId =
        event.queryStringParameters && event.queryStringParameters.drugsId;
      drugsId = drugsId === "all" ? drugsId : Number(drugsId);
      console.log("drugsId : ", drugsId);
      if (drugsId === "all") {
        response = await util.scanTable("drugs_table");
        response = util.buildResponse(200, response);
      } else {
        response = await drugsService.getDrug(drugsId);
      }
      return response;

    default:
      response = util.buildResponse(404, "404 Not Found");
  }
  return response;
};
