import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@ntgerbi/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

it("return 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asd123",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("return 401 when purchasing an order that does not belongs to current user", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup())
    .send({
      token: "asd123",
      orderId: order.id,
    })
    .expect(401);
});

it("return 400 when purchasing a cancelled order", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(order.userId))
    .send({
      token: "asd123",
      orderId: order.id,
    })
    .expect(400);
});

it("return a 204 with valid inputs", async () => {
  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signup(order.userId))
    .send({
      token: "asd123",
      orderId: order.id,
    })
    .expect(201);

  const chargeOpts = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOpts).toEqual({
    currency: "USD",
    amount: order.price * 100,
    source: "asd123",
  });

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: "card_1Jh0qWDAeiCkiyphXHPiqkMI",
  });

  expect(payment).not.toBeNull();
});
