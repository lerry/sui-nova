"use client";

import { useEffect, useState } from "react";
import {
  useCurrentWallet,
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import Link from "next/link";
import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { Button, useDisclosure } from "@nextui-org/react";

import { FormDataProps, TokenProps } from "./types";
import { CreateForm } from "./create-form";
import { SummaryPanel } from "./summary-panel";
import { Warning } from "./Warning";
import { TxDialog } from "./tx-dialog";

import { cn, checkSuiAddress } from "@/utils";
import { title } from "@/components/primitives";
import { IconBack } from "@/components/icons";

const tokens: TokenProps[] = [
  {
    symbol: "SUI",
    coinType: "0x2::sui::SUI",
    perValue: 10 ** 9,
  },
  // {
  //   symbol: "USDC",
  //   coinType:
  //     "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  //   perValue: Number(MIST_PER_USDC),
  // },
];

export default function CreatePage() {
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const [balance, setBalance] = useState(0);
  const currentAccount = useCurrentAccount();
  const { data: balanceData } = useSuiClientQuery("getAllBalances", {
    owner: currentAccount?.address as string,
  });

  const [form, setForm] = useState<FormDataProps>({
    token: tokens[0],
    amount: 0,
    cancelable: true,
    recipient: "",
    duration: 0,
  });

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [txDigest, setDigest] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [failedMessage, setFailedMessage] = useState("");

  useEffect(() => {
    if (balanceData) {
      const tokenBalance = balanceData.find(
        (item: any) => item.coinType === form.token.coinType,
      );

      if (tokenBalance) {
        const balance =
          Number.parseInt(tokenBalance.totalBalance ?? "0") /
          Number(form.token.perValue);

        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
  }, [balanceData]);

  // useEffect(() => {
  //   onOpen();
  // }, []);

  function updateForm(form: any) {
    setForm(form);
  }

  function CreatePoolAndPayStream() {
    setFailedMessage("");
    setDigest("");
    onOpen();
    const tx = new Transaction();
    // 1.split coins
    const [depositCoin] = tx.splitCoins(tx.gas, [
      form.amount * form.token.perValue,
    ]);
    const amountPerSec = parseInt(
      `${(form.amount / form.duration) * form.token.perValue}`,
    );

    // 2.Calling smart contract function to create payer pool and stream
    tx.moveCall({
      target: `0xa769a20c9b8e80078bdad52ce1a2ecc4fb0d7c8df815e3b089bb6893913042e5::liner_pay::createPayPoolAndStream`,
      arguments: [
        depositCoin,
        tx.pure.vector("address", [form.recipient]),
        tx.pure.vector("u64", [amountPerSec]),
        tx.object("0x6"),
      ],
    });
    console.log("params", [depositCoin, form.recipient, amountPerSec, "0x6"]);

    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onError: (err: Error) => {
          console.error(err.message);
          setFailedMessage(err.message);
        },
        onSuccess: (result) => {
          console.log(
            "successed create pool and stream, digest :",
            result.digest,
          );
          setDigest(result.digest);
        },
      },
    );
  }

  return (
    <section className="flex flex-col  gap-4 py-8 md:py-10">
      <TxDialog
        failedMessage={failedMessage}
        isOpen={isOpen}
        txDigest={txDigest}
        onOpenChange={onOpenChange}
      />
      <div className="flex items-center pb-8">
        <Link href="/app">
          <IconBack
            className="border border-white rounded-full mr-4 cursor-pointer hover:scale-105 transition-all"
            color="white"
            height={35}
            width={35}
          />
        </Link>
        <h2 className={cn(title(), "!text-2xl")}>Create Stream</h2>
      </div>
      <div className="panel  flex flex-col lg:flex-row gap-4 lg:gap-8 ">
        <CreateForm
          className="flex-1"
          formData={form}
          tokens={tokens}
          updateForm={updateForm}
        />
        <div className="summary basis-[460px] grow-0">
          <SummaryPanel balance={balance} formData={form} />
          <Warning balance={balance} form={form} />
          <Button
            className="w-full mt-4"
            color="primary"
            isDisabled={
              !currentWallet ||
              connectionStatus !== "connected" ||
              balance < form.amount ||
              !form.duration ||
              !checkSuiAddress(form.recipient)
            }
            size="lg"
            onClick={CreatePoolAndPayStream}
          >
            Create
          </Button>
        </div>
      </div>
    </section>
  );
}
