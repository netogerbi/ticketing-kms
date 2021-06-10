import request from "supertest";
import { app } from "../../app";

it("POST: /api/tickets", async () => {
  const r = await request(app).post("/api/tickets").send({});

  expect(r.status).not.toBe(404);
});

it("POST: /api/tickets - 401 should be authenticated", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("POST: /api/tickets - NOT 401 - authenticated", async () => {
  const cookie = global.signup();

  const r = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  expect(r.status).not.toBe(401);
});

it("POST: /api/tickets - 400 invalid title", async () => {
  const cookie = global.signup();

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: "10.2",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: "10.2",
    })
    .expect(400);
});

it("POST: /api/tickets - 400 invalid price", () => {});

it("POST: /api/tickets - 201 created", () => {});
