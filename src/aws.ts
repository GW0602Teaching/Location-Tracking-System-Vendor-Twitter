import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { TweetFormatted, TweetStream } from './types/twitter';

dotenv.config();

AWS.config.update({ region: process.env.AWS_REGION });

const { DynamoDB, SQS } = AWS;

const dynamodb = new DynamoDB();

const sqs = new SQS();

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
      throw e;
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

// 3 - Get All Scan Results
export const getAllScanResults = async <T>(
  tableName: string,
  limit: number = 25
) => {
  try {
    await dynamodbDescribeTable(tableName);
    const scanTableGen = await dynamodbScanTable(tableName, limit);

    const res: T[] = [];

    let isDone = false;

    while (!isDone) {
      const iterator = await scanTableGen.next();

      if (!iterator) {
        throw new Error('No iterator returned');
      }

      if (iterator.done || !iterator.value.LastEvaluatedKey) {
        isDone = true;
      }

      if (iterator.value) {
        iterator.value.Items!.forEach((item: any) => res.push(item));
      }
    }

    return res;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('getAllScanResults unexpected error');
  }
};

// 4 - Update Tweet field
export const dynamodbUpdateTweet = async (
  tableName: string,
  tweet: TweetFormatted,
  twitterId: string
) => {
  try {
    const params: AWS.DynamoDB.UpdateItemInput = {
      TableName: tableName,
      Key: marshall({ twitterId: twitterId }),
      UpdateExpression:
        'set #tweets = list_append(if_not_exists(#tweets, :empty_list), :tweet), #updated = :updated',
      ExpressionAttributeNames: {
        '#tweets': 'tweets',
        '#updated': 'updated',
      },
      ExpressionAttributeValues: marshall({
        ':tweet': [tweet],
        ':updated': Date.now(),
        ':empty_list': [],
      }),
    };

    const result = await dynamodb.updateItem(params).promise();
    console.log('Tweet added to record!');
    return result;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('dynamodbUpdateTweet error object unknown type');
  }
};

// 5 - SQS message
export const sqsSendMessage = async (
  queueUrl: string,
  body: string
) => {
  try {
    const params: AWS.SQS.SendMessageRequest = {
      MessageBody: body,
      QueueUrl: queueUrl,
    };

    const res = await sqs.sendMessage(params).promise();
    console.log('Send Message!');
    return res;
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
    throw new Error('sqsSendMessage error object unknown type');
  }
};
