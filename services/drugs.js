const util = require("../utils/util");
const drugsTable = "drugs_table";

async function getDrug(drugsId) {
  if (!drugsId) {
    return util.buildResponse(400, {
      message: "Drugs ID is required",
    });
  }

  try {
    const drugs = await util.getItem(drugsTable, drugsId);
    if (!drugs) {
      return util.buildResponse(404, {
        message: "Drugs not found",
      });
    }
    return util.buildResponse(200, drugs);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

async function addColumnFromOtherTable(
  drugsId,
  otherTable,
  otherColumn,
  newColumn,
  activeIngId
) {
  if (!drugsId || !otherTable || !otherColumn || !newColumn || !activeIngId) {
    return util.buildResponse(400, {
      message:
        "Drugs ID, other table, other column, new column ande activeIngId are required",
    });
  }

  try {
    const drugs = await util.getItem(drugsTable, drugsId);
    if (!drugs) {
      return util.buildResponse(404, {
        message: "Drugs not found",
      });
    }

    const otherData = await util.getItem(otherTable, activeIngId);
    if (!otherData || !otherData[otherColumn]) {
      return util.buildResponse(404, {
        message: "Other data not found",
      });
    }

    drugs[newColumn] = otherData[otherColumn];
    await util.updateItem(drugsTable, drugsId, drugs);

    return util.buildResponse(200, drugs);
  } catch (error) {
    return util.buildResponse(500, {
      message: "Server error, please try again later",
    });
  }
}

module.exports.addColumnFromOtherTable = addColumnFromOtherTable;
module.exports.getDrug = getDrug;
