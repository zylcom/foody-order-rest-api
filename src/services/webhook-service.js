import { prismaClient } from "../app/database.js";
import { ResponseError } from "../errors/response-error.js";
import { stripe } from "../plugin/stripe.js";

const webhook = async (request) => {
  console.log(request);

  // let event;

  // try {
  //   event = stripe.webhooks.constructEvent(request.body, request.sig, process.env.STRIPE_ENDPOINT_SECRET);
  // } catch (error) {
  //   throw new ResponseError(400, `Webhook error: ${error.message}`);
  // }

  // // Handle the event
  // switch (event.type) {
  //   case "checkout.session.async_payment_failed":
  //     const checkoutSessionAsyncPaymentFailed = event.data.object;

  //     console.log(
  //       // checkoutSessionAsyncPaymentFailed,
  //       "checkout.session.async_payment_failed"
  //     );
  //     break;

  //   case "checkout.session.async_payment_succeeded":
  //     const checkoutSessionAsyncPaymentSucceeded = event.data.object;

  //     console.log(
  //       // checkoutSessionAsyncPaymentSucceeded,
  //       "checkout.session.async_payment_succeeded"
  //     );
  //     break;

  //   case "checkout.session.completed":
  //     const checkoutSessionCompleted = event.data.object;

  //     console.log(checkoutSessionCompleted);

  //     const order = await prismaClient.order.update({
  //       where: { checkoutSessionId: checkoutSessionCompleted.id },
  //       data: {
  //         email: checkoutSessionCompleted.customer_details.email,
  //         status: "onprogress",
  //         subTotal: checkoutSessionCompleted.amount_subtotal,
  //         total: checkoutSessionCompleted.amount_total,
  //         payment: {
  //           create: {
  //             amount: checkoutSessionCompleted.amount_total,
  //             status: checkoutSessionCompleted.payment_status,
  //             method: checkoutSessionCompleted.payment_method_types.join(", "),
  //             name: checkoutSessionCompleted.customer_details.name,
  //             paymentIntent: checkoutSessionCompleted.payment_intent,
  //           },
  //         },
  //         shipment: {
  //           create: {
  //             address: checkoutSessionCompleted.customer_details.address.line1,
  //             city: checkoutSessionCompleted.customer_details.address.city,
  //             country: checkoutSessionCompleted.customer_details.address.country,
  //             zipCode: checkoutSessionCompleted.customer_details.address.postal_code,
  //             state: checkoutSessionCompleted.customer_details.address.state,
  //             detail: checkoutSessionCompleted.customer_details.address.line2,
  //             name: checkoutSessionCompleted.customer_details.name,
  //             phone: checkoutSessionCompleted.customer_details.phone,
  //             cost: checkoutSessionCompleted.shipping_cost.amount_total,
  //           },
  //         },
  //       },
  //     });

  //     if (order.username) {
  //       await prismaClient.cart.update({ where: { username: order.username }, data: { cartItems: { deleteMany: {} } } });
  //     }
  //     break;

  //   case "checkout.session.expired":
  //     const checkoutSessionExpired = event.data.object;

  //     console.log(
  //       // checkoutSessionExpired,
  //       "checkout.session.expired"
  //     );
  //     break;

  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }
};

export default { webhook };
