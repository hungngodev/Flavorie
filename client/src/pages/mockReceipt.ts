export type ReceiptType = {
  name: string;
  price: string;
  quantity: string;
};
export type MockReceiptType = {
  receipts: ReceiptType[];
};
export const mockReceipts: MockReceiptType = {
  receipts: [
    {
      name: 'Lorem ipsum',
      price: '$9.20',
      quantity: '1',
    },
    {
      name: 'Lorem ipsum dolor sit',
      price: '$19.20',
      quantity: '1',
    },
    {
      name: 'Lorem ipsum dolor sit amet',
      price: '$15.00',
      quantity: '1',
    },
    {
      name: 'Lorem ipsum',
      price: '$15.00',
      quantity: '1',
    },
    {
      name: 'Lorem ipsum dolor sit',
      price: '$15.00',
      quantity: '1',
    },
    {
      name: 'Lorem ipsum',
      price: '$19.20',
      quantity: '1',
    },
  ],
};
