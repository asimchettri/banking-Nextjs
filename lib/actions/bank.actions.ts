"use server";
import { CountryCode, WebhookType, SandboxItemFireWebhookRequestWebhookCodeEnum } from "plaid";
import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";
import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    const banks = await getBanks({ userId });

    const accounts = await Promise.all(
      banks?.map(async (bank: Bank) => {
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        return {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          sharableId: bank.sharableId,
        };
      })
    );

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    const bank = await getBank({ documentId: appwriteItemId });

    const accountsResponse = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });
    const accountData = accountsResponse.data.accounts[0];

    const transferTransactionsData = await getTransactionsByBankId({
      bankId: bank.$id,
    });

    const transferTransactions = (transferTransactionsData?.documents ?? []).map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.amount!,
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    const transactions = await getTransactions({
      accessToken: bank.accessToken,
    });

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    const allTransactions = [...(transactions ?? []), ...transferTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({ data: account, transactions: allTransactions });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

export const getInstitution = async ({ institutionId }: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });
    return parseStringify(institutionResponse.data.institution);
  } catch (error) {
    console.error("An error occurred while getting the institution:", error);
  }
};

export const getTransactions = async ({ accessToken }: getTransactionsProps) => {
  try {
    await plaidClient.sandboxItemFireWebhook({
      access_token: accessToken,
      webhook_type: WebhookType.Transactions,
      webhook_code: SandboxItemFireWebhookRequestWebhookCodeEnum.SyncUpdatesAvailable,
    }).catch(() => {});

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: '2024-01-01',
      end_date: new Date().toISOString().split('T')[0],
    });
   

  const transactions = response.data.transactions.map((transaction) => {
  return {
    id: transaction.transaction_id,
    name: transaction.name,
    paymentChannel: transaction.payment_channel,
    type: transaction.payment_channel,
    accountId: transaction.account_id,
    amount: transaction.amount,
    pending: transaction.pending,
    category: transaction.personal_finance_category?.primary 
      ?? transaction.category?.[0] 
      ?? 'Other',
    date: transaction.date,
    image: transaction.logo_url,
  };
});

    return parseStringify(transactions);
  } catch (error) {
      const axiosError = error as any;
  console.error('Plaid error details:', axiosError?.response?.data);
  return [];
  }
};