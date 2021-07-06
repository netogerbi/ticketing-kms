import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("PUT: /api/tickets/:id - 404 Record Not Found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(404);
});

it("PUT: /api/tickets/:id - 401 Unauthorized", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).put(`/api/tickets/${id}`).send({}).expect(401);
});

it("PUT: /api/tickets/:id - 401 Unauthorized - user not own ticket", async () => {
  const r = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", global.signup())
    .send({
      title: "Rock in Rio",
      price: 800.5,
    })
    .expect(401);
});

it("PUT: /api/tickets/:id - 400 title and price validation error", async () => {
  const cookie = global.signup();

  const r = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Rock in Rio",
      price: -1,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Rock in Rio",
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10.2,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 10.2,
    })
    .expect(400);
});

it("PUT: /api/tickets/:id - 200 OK", async () => {
  const cookie = global.signup();

  const r = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(201);

  const r2 = await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Rock in Rio",
      price: 800.5,
    })
    .expect(200);

  expect(r2.body.title).toMatch(/Rock in Rio/);
  expect(r2.body.price).toBe(800.5);
});

it("should publish ticket updated event", async () => {
  const cookie = global.signup();

  const r = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(201);

  const r2 = await request(app)
    .put(`/api/tickets/${r.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Rock in Rio",
      price: 800.5,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
