import request from "supertest";
import { app } from "../../app";

it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);

  const r = await request(app).post("/api/users/signout").send({}).expect(200);

  expect(r.get("Set-Cookie")).toEqual([
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly",
  ]);
});
