const util = require("../utils/util");
const drugsTable = "drugs_table";

async function getDrug(drugsId) {
  if (!drugsId) {
    return util.buildResponse(400, {
      message: "Recipe ID is required",
    });
  }

  try {
    const drugs = await util.getItem(drugsTable, drugsId);
    if (!drugs) {
      return util.buildResponse(404, {
        message: "Recipe not found",
      });
    }
    return util.buildResponse(200, drugs);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

module.exports.getDrug = getDrug;
