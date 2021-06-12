import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("PUT: /api/tickets/:id - 404 Record Not Found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signup())
    .send({})
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
