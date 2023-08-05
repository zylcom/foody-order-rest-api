import validate from "../validation/validation.js";
import { cancelOrderValidation, checkoutValidation, createOrderValidation, getOrderValidation } from "../validation/order-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { stripe } from "../plugin/stripe.js";
import { calculateTotalPrice } from "../utils/index.js";

const create = async (username) => {
  username = validate(createOrderValidation, username);

  const items = await prismaClient.cartItem.findMany({ where: { cart: { username } }, include: { product: true } });

  if (items.length < 1) {
    throw new ResponseError(400, "At least you must have one item in cart to create an order!");
  }

  const orderItems = items.map((item) => ({
    quantity: item.quantity,
    price: item.product.price,
    productName: item.product.name,
    product: { connect: { slug: item.productSlug } },
  }));

  const totalPrice = calculateTotalPrice(items);

  return prismaClient.order.create({
    data: {
      subTotal: totalPrice,
      total: totalPrice,
      items: {
        create: orderItems,
      },
      user: { connect: { username } },
    },
    include: {
      items: { include: { product: true } },
    },
  });
};

const checkout = async (request) => {
  request = validate(checkoutValidation, request);

  const order = await prismaClient.order.findUnique({ where: { id: request.orderId }, include: { items: { include: { product: true } }, checkoutSession: true } });

  if (!order) {
    throw new ResponseError(404, "Order is invalid!");
  }

  let stripeOptions = {
    payment_method_types: ["card"],
    currency: "usd",
    mode: "payment",
    success_url: "http://localhost:5173/checkout?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: `http://localhost:5173/order/${order.id}`,
    client_reference_id: request.userId,
    phone_number_collection: { enabled: true },
    shipping_address_collection: {
      allowed_countries: ["ID"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping (faster when on low demand)",
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 2,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 1500,
            currency: "usd",
          },
          display_name: "Hunngry Up (always fast even on high demand)",
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
          },
        },
      },
    ],
    custom_text: {
      shipping_address: {
        message: "Fill address line 2 field with your house detail (number/color/position)",
      },
    },
  };

  if (!!order.checkoutSessionId && Date.now() < new Date(order.checkoutSession?.expiresAt).getTime()) {
    return order.checkoutSession;
  }

  stripeOptions.line_items = order.items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [`https://picsum.photos/1920/1280.webp?random=${item.product.id}`],
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    };
  });

  const session = await stripe.checkout.sessions.create(stripeOptions);

  return prismaClient.checkoutSession.create({
    data: { sessionId: session.id, url: session.url, expiresAt: new Date(session.expires_at * 1000), order: { connect: { id: order.id } } },
  });
};

const get = async (request) => {
  request = validate(getOrderValidation, request);

  const user = await prismaClient.user.findUnique({
    where: { username: request.username },
    include: { orders: { where: { id: request.orderId }, include: { items: { include: { product: true } } } } },
  });

  if (user.orders.length < 1) {
    throw new ResponseError(404, "Order not found");
  }

  return user.orders[0];
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
