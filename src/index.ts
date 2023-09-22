import { dynamodbDescribeTable, dynamodbScanTable } from './aws';

const init = async () => {
  const TABLE_NAME_CONST = 'vendors';
  const res = dynamodbDescribeTable(TABLE_NAME_CONST);
  console.log(res);

  const scanIterator = await dynamodbScanTable(TABLE_NAME_CONST, 5);
  console.log((await scanIterator.next()).value);
  console.log((await scanIterator.next()).value);
};

init();
