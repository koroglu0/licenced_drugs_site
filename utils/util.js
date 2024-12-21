const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-north-1",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

async function getItem(tableName, item) {
  const params = {
    TableName: tableName,
    Key: {
      id: item,
    },
  };

  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        console.log("\n\nline 58 response:", response, "\n\n");
        return response.Item;
      },
      (error) => {
        console.error("\n\nthere is an error getting user :", error);
      }
    );
}

const saveItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        return true;
      },
      (error) => {
        console.error("there is an error saving user:", error);
      }
    );
};

const scanTable = async (tableName) => {
  const params = {
    TableName: tableName,
  };

  return await dynamodb
    .scan(params)
    .promise()
    .then(
      (response) => {
        return response.Items;
      },
      (error) => {
        console.error("There is an error getting items:", error);
        throw new Error(error);
      }
    );
};

const updateItem = async (params) => {
  return await dynamodb
    .update(params)
    .promise()
    .then(
      (response) => {
        return response.Attributes;
      },
      (error) => {
        console.error("There is an error updating item:", error);
        throw new Error(error);
      }
    );
};

async function paginatedScan(params, limit = Infinity) {
  const items = [];
  let count = 0;
  let lastEvaluatedKey = null;

  do {
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const result = await dynamodb.scan(params).promise();
    items.push(...result.Items);
    count += result.Count;
    lastEvaluatedKey = result.LastEvaluatedKey;

    if (count >= limit) {
      break;
    }

  } while (lastEvaluatedKey);

  return {
    Items: items,
    Count: count
  };
}

module.exports.scanTable = scanTable;
module.exports.saveItem = saveItem;
module.exports.getItem = getItem;
module.exports.buildResponse = buildResponse;
module.exports.updateItem = updateItem;
module.exports.paginatedScan = paginatedScan;