import {
  dynamodbDescribeTable,
  dynamodbScanTable,
  getAllScanResults,
} from './aws';
import dotenv from 'dotenv';
import { Vendor } from './types/vendor';

dotenv.config();

const init = async () => {
  const TABLE_NAME_CONST = 'vendors';
  //   const res = dynamodbDescribeTable(TABLE_NAME_CONST);
  //   console.log(res);

  //   const scanIterator = await dynamodbScanTable(TABLE_NAME_CONST, 5);
  //   console.log((await scanIterator.next()).value);
  //   console.log((await scanIterator.next()).value);

  const vendors = await getAllScanResults<Vendor>(
    process.env.AWS_VENDORS_TABLE_NAME ?? ''
  );
  console.log(vendors);
};

init();
