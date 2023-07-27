import validate from "../validation/validation.js";
import { checkoutValidation, createOrderValidation } from "../validation/order-validation.js";
import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { stripe } from "../plugin/stripe.js";

const create = async (username) => {
  username = validate(createOrderValidation, username);

  const cart = await prismaClient.cart.findUnique({ where: { username }, include: { cartItems: { include: { product: true } } } });

  if (cart.cartItems.length < 1) {
    throw new ResponseError(400, "At least you must have one item in cart to create an order!");
  }

  return prismaClient.order.create({
    data: {
      subTotal: cart.totalPrice,
      total: cart.totalPrice,
      items: {
        create: cart.cartItems.map((item) => ({
          quantity: item.quantity,
          price: item.product.price,
          productName: item.product.name,
          product: { connect: { slug: item.productSlug } },
        })),
      },
      user: { connect: { username } },
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

export default { create, checkout };
