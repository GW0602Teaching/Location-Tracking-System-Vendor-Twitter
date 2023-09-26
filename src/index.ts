import {
  dynamodbDescribeTable,
  dynamodbScanTable,
  getAllScanResults,
  dynamodbUpdateTweet,
  sqsSendMessage,
} from './aws';
import dotenv from 'dotenv';
import { Vendor } from './types/vendor';
import { Rule } from './types/twitter';
import {
  setRules,
  getAllRules,
  deleteAllRules,
  streamVendors,
} from './twitter';
import express from 'express';
import healthCheck from './healthCheck';

dotenv.config();

const init = async () => {
  const TABLE_NAME_CONST = 'vendors';
  //   const res = dynamodbDescribeTable(TABLE_NAME_CONST);
  //   console.log(res);

  //   const scanIterator = await dynamodbScanTable(TABLE_NAME_CONST, 5);
  //   console.log((await scanIterator.next()).value);
  //   console.log((await scanIterator.next()).value);

  // await dynamodbUpdateTweet(
  //   process.env.AWS_VENDORS_TABLE_NAME ?? '',
  //   {
  //     id: 'tweet1',
  //     userId: 'DCTacoTruck',
  //     userName: 'DC Taco Truck',
  //     text: 'Test tweet',
  //     date: '09/12/23',
  //     geo: {
  //       id: 'geo1',
  //       name: 'Geo location 1',
  //       place_type: 'place 1',
  //       full_name: 'place 1',
  //       country: 'USA',
  //       country_code: 'USA',
  //       coordinates: {
  //         lat: 34.01283,
  //         long: 41.1818,
  //       },
  //     },
  //   },
  //   'DCTacoTruck'
  // );

  // await sqsSendMessage(
  //   'https://sqs.us-east-1.amazonaws.com/525480118775/testqueue1',
  //   'testMsg1'
  // );

  // const vendors = await getAllScanResults<Vendor>(
  //   process.env.AWS_VENDORS_TABLE_NAME ?? ''
  // );

  // const vendorIdList = vendors.map((item) => item.twitterId);

  // const rules: Rule[] = [
  //   {
  //     value: `has:geo (from:${vendorIdList.join(` OR from:`)})`,
  //     tag: 'vendors-geo',
  //   },
  // ];

  // await setRules(rules);

  // const rules = await getAllRules();
  // console.log(rules);
  // await deleteAllRules(rules);

  try {
    // const vendors = await getAllScanResults<Vendor>(
    //   process.env.AWS_VENDORS_TABLE_NAME ?? ''
    // );

    // const vendorList = vendors.map((vendor) => vendor.twitterId);

    // await streamVendors(vendorList);

    const app = express();
    app.use('/', healthCheck);
    app.listen(process.env.PORT, () =>
      console.log(
        `Health Check listening on port ${process.env.PORT}`
      )
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      process.exit(1);
    }

    console.log('init unexpected error');
    process.exit(1);
  }
};

init();
