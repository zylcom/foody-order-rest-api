import validate from "../validation/validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { getPaymentValidation } from "../validation/payment-validation.js";

const get = async (request) => {
  request = validate(getPaymentValidation, request);

  const payment = await prismaClient.payment.findFirst({
    where: { AND: [{ transactionId: request.transactionId }, { OR: [{ username: request.username }, { guestId: request.guestUserId }] }] },
    include: { order: { include: { shipment: true, items: { include: { product: true } } } } },
  });

  if (!payment) {
    throw new ResponseError(404, "Payment record not found!");
  }

  return payment;
};

export default {
  get,
};
