'use client';

import { title } from "@/components/primitives";
import { useSuiClientQuery, useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import React from "react";
import { MIST_PER_SUI } from '@mysten/sui/utils';



function QueryObjects() {
  const { data, isPending, error, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: '0xc494732d09de23389dbe99cb2f979965940a633cf50d55caa80ed9e4fc4e521e',
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function CreatePool() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');
  const currentAccount = useCurrentAccount();

  const tx = new Transaction();
  tx.moveCall({
    target: '0x8096b927f041dbcb156aa0dfa8e6804fe8c9383d9ed15dee5fae5c2d70cd7dd7::liner_pay::createAndDeposit',
    arguments: [
      tx.object('0x373569027e0fdd0203b22d061307336c3fa7f9b7b0b82225144bbc436c6fa20a'),
    ],
  });


  return (
    <div style={{ padding: 20 }}>
      {currentAccount && (
        <>
          <div>
            <Button color="primary"
              onClick={() => {
                signAndExecuteTransaction(
                  {
                    transaction: tx,
                  },
                  {
                    onSuccess: (result) => {
                      console.log('executed create pool transaction', result);
                      setDigest(result.digest);
                    },
                  },
                );
              }}
            >
              Create Pool
            </Button>
          </div>
          <div>Digest: {digest}</div>
        </>
      )}
    </div>
  );
}

function WalletBalance() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // 来自于用户的输入框
  const input_amount = 100;


  const my_account = useCurrentAccount();
  const { data, isPending, error, refetch } = useSuiClientQuery('getBalance', {
    owner: my_account?.address as string,
  });
  
  console.log(`balance data:  ${data}`);
  const my_balance = Number.parseInt(data?.totalBalance ?? '0') / Number(MIST_PER_SUI);

  // todo 判断 amount、balance
  // if (my_balance <= input_amount) {
  //   return <div>余额不足</div>;
  // }

  // 获取 SUI coin 对象
  const mySuiCoins = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: my_account?.address as string,
      filter: {
        MatchAll: [
          {
            StructType: "0x2::coin::Coin<0x2::sui::SUI>",
          },
          {
            AddressOwner: my_account?.address as string,
          },
        ],
      },
      options: {
        showOwner: true,
        showType: true,
      },
    },
  );

  console.log(`mySuiCoins: ${JSON.stringify(mySuiCoins, null, 2)}`);
  const mySuiCoinIds = mySuiCoins?.data?.data?.map((item) => item?.data?.objectId) ?? [];
  console.log(`mySuiCoinIds: ${mySuiCoinIds}`);
  console.log(`mySuiCoinIds 0: ${mySuiCoinIds[0] as string}`);

  // join_vec
  const tx = new Transaction();
  tx.moveCall({
    target: "0x2::pay::join_vec",
    arguments: [
      tx.object(mySuiCoinIds[0] as string),
      ...mySuiCoinIds.slice(1).filter((id): id is string => id !== undefined).map((id) => tx.object(id)),
    ],
  });

  signAndExecuteTransaction(
    {
      transaction: tx,
    },
    {
      onSuccess: (result) => {
        console.log('executed create pool transaction', result);
      },
    },
  );

  // create pool


  return (
    <div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre>   */}
      <pre>{JSON.stringify(mySuiCoins?.data, null, 2)}</pre>  
    </div>
  )



  
}


export default function AboutPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Create</h1>
        {/* <QueryObjects /> */}
        <CreatePool />
        <WalletBalance />
      </div>
    </section>
  );
}
