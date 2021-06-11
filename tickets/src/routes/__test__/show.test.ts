import request from "supertest";
import { app } from "../../app";

it("GET: /api/tickets/:id - 404 Not Found", async () => {
  await request(app).get("/api/tickets/:id").send().expect(404);
});

it("GET: /api/tickets/:id - 200 ok", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title: "Test title",
      price: 10.2,
    })
    .expect(201);

  const r = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(r.body.title).toMatch(/Test title/);
  expect(r.body.price).toBe(10.2);
});
