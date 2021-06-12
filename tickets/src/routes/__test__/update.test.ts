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
