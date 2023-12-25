import cartService from "./cart-service.js";
import validate from "../validation/validation.js";
import { cancelOrderValidation, checkoutValidation, createOrderValidation, getOrderValidation } from "../validation/order-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { calculateTotalPrice } from "../utils/index.js";
import { snap } from "../plugin/midtrans.js";

const create = async (request) => {
  const items = await cartService.validateCart(request.cart).then((response) => response.cartItems);
  request = validate(createOrderValidation, request);

  if (items.length < 1) {
    throw new ResponseError(400, "At least you must have one item in cart to create an order!");
  }

  const orderItems = items.map((item) => ({
    quantity: item.quantity,
    price: item.product.price,
    productName: item.product.name,
    product: { connect: { slug: item.productSlug } },
  }));

  const subTotal = calculateTotalPrice(items);
  const total = subTotal + request.deliveryDetails.cost;

  return prismaClient.order.create({
    data: {
      subTotal: subTotal,
      total,
      name: request.customerDetails.name,
      items: {
        create: orderItems,
      },
      user: request.username ? { connect: { username: request.username } } : undefined,
      guestId: request?.guestUserId,
      shipment: {
        create: {
          ...request.shippingDetails,
          name: request.customerDetails.name,
          phone: request.customerDetails.phonenumberForm.number,
          cost: request.deliveryDetails.cost,
          method: request.deliveryDetails.method,
          deliveryDetails: undefined,
        },
      },
      payment: {
        create: {
          amount: total,
          name: request.customerDetails.name,
          username: request?.username,
          guestId: request?.guestUserId,
        },
      },
    },
    include: {
      items: { include: { product: true } },
      shipment: true,
      payment: true,
    },
  });
};

const checkout = async (request) => {
  request = validate(checkoutValidation, request);

  const order = await prismaClient.order.findUnique({
    where: { id: request.orderId },
    include: {
      items: { include: { product: true } },
      user: { include: { profile: true } },
      shipment: true,
      payment: true,
    },
  });

  if (!order) {
    throw new ResponseError(404, "Order not found!");
  }

  if (order?.payment?.status === "paid") {
    return "Your order already completed.";
  }

  const transactionData = await snap.transaction
    .status(order.id)
    .then((response) => response)
    .catch(() => null);

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: order.total,
    },
    credit_card: { secure: true },
    customer_details: {
      first_name: order.name,
      last_name: "",
      username: order.username || undefined,
      phone: order.shipment.phone,
      shipping_address: {
        first_name: order.name,
        last_name: "",
        username: order.username || undefined,
        phone: order.shipment.phone,
        address: order.shipment.address,
        city: order.shipment.city,
        postal_code: order.shipment.postalCode,
        method: order.shipment.method,
        cost: order.shipment.cost,
        status: order.shipment.status,
        detail: order.shipment.detail,
        state: order.shipment.state,
      },
    },
    item_details: [
      ...order.items.map((item) => ({ id: item.product.id, price: item.price, quantity: item.quantity, name: item.productName })),
      { id: "dc-".concat(order.id), price: order.shipment.cost, quantity: 1, name: "Delivery cost" },
    ],
  };

  if (transactionData && transactionData.transaction_status !== "expire") {
    return order.transactionToken;
  } else if (order.transactionToken && !transactionData) {
    return order.transactionToken;
  } else {
    const transactionToken = await snap.createTransactionToken(parameter);

    await prismaClient.order.update({ where: { id: order.id }, data: { transactionToken } });

    return transactionToken;
  }
};

const get = async (request) => {
  request = validate(getOrderValidation, request);

  const order = await prismaClient.order.findFirst({
    where: { AND: [{ id: request.orderId }, { OR: [{ username: request.username }, { guestId: request.guestUserId }] }] },
    include: { payment: true, shipment: true, items: { include: { product: true } } },
  });

  if (!order) {
    throw new ResponseError(404, "Order not found");
  }

  return order;
};

const cancel = async (request) => {
  request = validate(cancelOrderValidation, request);

  const order = await get(request);

  if (!order) {
    throw new ResponseError(404, "Order not found");
  }

  return prismaClient.order.update({ where: { id: order.id }, data: { status: "canceled" }, include: { items: { include: { product: true } } } });
};

export default { create, checkout, get, cancel };
