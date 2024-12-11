const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-north-1",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = "drugs_table"; // İlaç bilgilerinin tutulduğu tablo adı

/**
 * İlaçları filtreleyen fonksiyon
 * @param {Object} filters - Kullanıcıdan gelen filtreleme kriterleri
 * @returns {Promise<Object[]>} Filtrelenmiş veriler
 */
const filterDrugs = async (filters) => {
  try {
    console.log("Filters received:", filters); // Gelen filtreleri loglayın

    const filterExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    // Dinamik olarak filtreleme kriterleri ekle
    if (filters.name) {
      filterExpression.push("contains(#name, :name)");
      expressionAttributeValues[":name"] = filters.name.toLowerCase();
      expressionAttributeNames["#name"] = "name";
    }

    // if (filters.activeSubstance) {
    //   filterExpression.push("contains(#activeSubstance, :activeSubstance)");
    //   expressionAttributeValues[":activeSubstance"] = filters.activeSubstance;
    //   expressionAttributeNames["#activeSubstance"] = "activeSubstance";
    // }

    // if (filters.licenseHolder) {
    //   filterExpression.push("#licenseHolder = :licenseHolder");
    //   expressionAttributeValues[":licenseHolder"] = filters.licenseHolder;
    //   expressionAttributeNames["#licenseHolder"] = "licenseHolder";
    // }

    console.log("FilterExpression:", filterExpression.join(" AND "));
    console.log("ExpressionAttributeValues:", expressionAttributeValues);
    console.log("ExpressionAttributeNames:", expressionAttributeNames);

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: filterExpression.join(" AND "),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };

    console.log("DynamoDB Scan Parameters:", params);

    const data = await dynamoDb.scan(params).promise();
    console.log("Scan result:", data);
    return data.Items; // Filtrelenmiş veriler
  } catch (error) {
    console.error("Filtreleme hatası:", error);
    throw new Error("Filtreleme sırasında bir hata oluştu.");
  }
};

module.exports = { filterDrugs };
