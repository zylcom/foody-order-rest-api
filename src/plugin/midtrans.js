import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({ isProduction: false, serverKey: process.env.MIDTRANS_SERVER_KEY });

export { snap };
