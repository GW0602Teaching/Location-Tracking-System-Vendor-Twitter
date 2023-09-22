import { unmarshall } from '@aws-sdk/util-dynamodb';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

AWS.config.update({ region: process.env.AWS_REGION });

const { DynamoDB } = AWS;

const dynamodb = new DynamoDB();

// 1 - Describe a table
export const dynamodbDescribeTable = async (tableName: string) => {
  try {
    const res = await dynamodb
      .describeTable({ TableName: tableName })
      .promise();
    console.log('Table retrieved', res);
    return res;
  } catch (e) {
    if (e instanceof Error) {
      return e;
    }
    console.error(e);
    throw new Error('dynamodbDescribeTable error');
  }
};

// 2 - Scan method
export const dynamodbScanTable = async function* (
  tableName: string,
  limit: number = 25,
  lastEvaluatedKey?: AWS.DynamoDB.Key
) {
  while (true) {
    const params: AWS.DynamoDB.ScanInput = {
      TableName: tableName,
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    try {
      const result = await dynamodb.scan(params).promise();
      if (!result.Count) {
        return;
      }

      lastEvaluatedKey = (result as AWS.DynamoDB.ScanOutput)
        .LastEvaluatedKey;

      result.Items = result.Items?.map((item) => unmarshall(item));

      yield result;
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error('dynamodbScanTable error');
    }
  }
};
