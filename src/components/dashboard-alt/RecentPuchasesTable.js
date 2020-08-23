import React, { useState } from 'react';
import PurchasesTable from './PurchasesTable';
import FalconCardHeader from '../common/FalconCardHeader';
import { InputGroup, CustomInput, Button, Card, CardBody } from 'reactstrap';
import ButtonIcon from '../common/ButtonIcon';
import RecentTxsDataProvider from './RecentTxDataProvider';

const RecentPurchasesTable = () => {
  const pageSize = 10;
  const pageNums = [1,2,3,4,5,6,7,8,9,10];
  const totalSize=100;


  return (
    <Card className="mb-3">
      <FalconCardHeader title="Recent Transactions" titleTag="h5" light={false}>
      </FalconCardHeader>
      <CardBody className="p-0">
      <RecentTxsDataProvider>
        <PurchasesTable 
          pageSize={pageSize}
          pageNums={pageNums}
          totalSize={totalSize}
        />
      </RecentTxsDataProvider>
      </CardBody>
    </Card>
  );
};

export default RecentPurchasesTable;
