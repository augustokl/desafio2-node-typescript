import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';
import ConvertCsvFileService from './ConvertCsvFileService';

import uploadConfig from '../config/upload';

interface Request {
  filename: string;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const convertCsvFile = new ConvertCsvFileService();

    const path = `${uploadConfig.folder}/${filename}`;

    const lines: string[] = await convertCsvFile.execute(path);

    const transactions: Transaction[] = [];

    for (const line of lines) {
      const [title, type, value, category] = line;

      const transaction = await createTransaction.execute({
        title,
        type: type as 'income' | 'outcome',
        value: Number(value),
        category,
      });

      transactions.push(transaction);
    }

    // const transactions = await Promise.all(
    //   lines.map(async line => {
    //     const [title, type, value, category] = line;

    //     const transaction = createTransaction.execute({
    //       title,
    //       type: type as 'income' | 'outcome',
    //       value: Number(value),
    //       category,
    //     });

    //     Promise.resolve(transaction);

    //     return transaction;
    //   }),
    // );

    return transactions;
  }
}

export default ImportTransactionsService;
