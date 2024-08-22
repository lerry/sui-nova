export type TokenProps = {
  symbol: string;
  coinType: string;
  perValue: number;
};

export type FormDataProps = {
  token: TokenProps;
  amount: number;
  cancelable: boolean;
  recipient: string;
  duration: number;
};
