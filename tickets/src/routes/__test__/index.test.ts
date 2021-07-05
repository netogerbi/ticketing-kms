import request from "supertest";
import { app } from "../../app";

const createTicket = async () => {
  await request(app).post("/api/tickets").set("Cookie", global.signup()).send({
    title: "Test title",
    price: 10.2,
  });
};

it("GET: /api/tickets - 200 OK", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const r = await request(app).get(`/api/tickets`).send().expect(200);

  expect(r.body).toHaveLength(3);
});
