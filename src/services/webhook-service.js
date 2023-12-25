import { prismaClient } from "../app/database.js";
import { snap } from "../plugin/midtrans.js";

const webhook = async (notificationJson) => {
  /**
  {
    transaction_time: '2023-12-23 16:42:13',
    transaction_status: 'pending',
    transaction_id: 'd33d1747-f265-4a64-89b8-f02982e73032',
    store: 'alfamart',
    status_message: 'midtrans payment notification',
    status_code: '201',
    signature_key: '96b99b66bf45f3736bbf202b6c97e5b0b2d66da819b4112a77b34afffc3e4155379fa740594c7225bf789468dab349101295af096fc22501a6e10456b49ca226',
    payment_type: 'cstore',
    payment_code: '3101101715649288',
    order_id: '76a1b635-5964-462d-a224-3a42008d9abb',
    merchant_id: 'G310191577',
    gross_amount: '167500.00',
    fraud_status: 'accept',
    expiry_time: '2023-12-24 16:42:13',
    currency: 'IDR'
  }
   */

  snap.transaction.notification(notificationJson).then(async (statusResponse) => {
    console.log(statusResponse);

    console.log(
      `Transaction notification received.
      Order ID: ${statusResponse.order_id}.
      Transaction status: ${statusResponse.transaction_status}.
      Fraud status: ${statusResponse.fraud_status}`
    );

    if (transactionStatus == "capture") {
      // capture only applies to card transaction, which you need to check for the fraudStatus
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your databaase to 'challenge'
        await prismaClient.order.update({
          where: { id: statusResponse.order_id },
          data: {
            status: "challenge",
            payment: {
              update: {
                amount: statusResponse.gross_amount,
                method: notificationJson.payment_type,
                status: "challenge",
                signatureKey: statusResponse.signature_key,
                store: statusResponse.store,
                currency: statusResponse.currency,
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
                amount: statusResponse.gross_amount,
                method: notificationJson.payment_type,
                status: "paid",
                signatureKey: statusResponse.signature_key,
                store: statusResponse.store,
                currency: statusResponse.currency,
              },
            },
          },
        });
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your databaase to 'success'
      await prismaClient.order.update({
        where: { id: statusResponse.order_id },
        data: {
          status: "success",
          payment: {
            update: {
              amount: statusResponse.gross_amount,
              method: notificationJson.payment_type,
              status: "paid",
              signatureKey: statusResponse.signature_key,
              store: statusResponse.store,
              currency: statusResponse.currency,
            },
          },
        },
      });
    } else if (transactionStatus == "deny") {
      // TODO you can ignore 'deny', because most of the time it allows payment retries
      // and later can become success
    } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
      // TODO set transaction status on your databaase to 'failure'
      await prismaClient.order.update({ where: { id: statusResponse.order_id }, data: { status: "failure" } });
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your databaase to 'pending' / waiting payment
      await prismaClient.order.update({ where: { id: statusResponse.order_id }, data: { status: "pending" } });
    }
  });
};

export default { webhook };
