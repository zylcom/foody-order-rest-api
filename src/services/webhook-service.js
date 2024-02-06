import { prismaClient } from "../app/database.js";
import { snap } from "../plugin/midtrans.js";

const webhook = async (notificationJson) => {
  await snap.transaction.notification(notificationJson).then(async (statusResponse) => {
    console.log(
      `Transaction notification received.
      Order ID: ${statusResponse.order_id}.
      Transaction status: ${statusResponse.transaction_status}.
      Fraud status: ${statusResponse.fraud_status}`
    );

    if (statusResponse.transaction_status == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your databaase to 'challenge'
        await prismaClient.order.update({
          where: { id: statusResponse.order_id },
          data: {
            status: "challenge",
            payment: {
              update: {
                amount: +statusResponse.gross_amount,
                method: notificationJson.payment_type,
                status: "challenge",
                signatureKey: statusResponse.signature_key,
                store: statusResponse.store,
                currency: statusResponse.currency,
                transactionId: statusResponse.transaction_id,
              },
            },
          },
        });
      } else if (fraudStatus == "accept") {
        // TODO set transaction status on your databaase to 'success'
        await prismaClient.order.update({
          where: { id: statusResponse.order_id },
          data: {
            status: "success",
            payment: {
              update: {
                amount: +statusResponse.gross_amount,
                method: notificationJson.payment_type,
                status: "paid",
                signatureKey: statusResponse.signature_key,
                store: statusResponse.store,
                currency: statusResponse.currency,
                transactionId: statusResponse.transaction_id,
              },
            },
          },
        });
      }
    } else if (statusResponse.transaction_status == "settlement") {
      // TODO set transaction status on your databaase to 'success'
      await prismaClient.order.update({
        where: { id: statusResponse.order_id },
        data: {
          status: "success",
          payment: {
            update: {
              amount: +statusResponse.gross_amount,
              method: notificationJson.payment_type,
              status: "paid",
              signatureKey: statusResponse.signature_key,
              store: statusResponse.store,
              currency: statusResponse.currency,
              transactionId: statusResponse.transaction_id,
            },
          },
        },
      });
    } else if (statusResponse.transaction_status == "deny") {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (statusResponse.transaction_status == "cancel" || statusResponse.transaction_status == "expire") {
      // TODO set transaction status on your databaase to 'failure'
      await prismaClient.order.update({ where: { id: statusResponse.order_id }, data: { status: "failure" } });
    } else if (statusResponse.transaction_status == "pending") {
      // TODO set transaction status on your databaase to 'pending' / waiting payment
      await prismaClient.order.update({ where: { id: statusResponse.order_id }, data: { status: "pending" } });
    }
  });
};

export default { webhook };
