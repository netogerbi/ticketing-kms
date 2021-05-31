import request from "supertest";
import { app } from "../../app";

it("responds with details about current user", async () => {
  const signup = await request(app)
    .post("/api/users/signup")
    .send({
      email: "netera@gmail.com",
      password: "3214",
    })
    .expect(201);

  const r = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", signup.get("Set-Cookie"))
    .expect(200);

  expect(r.body.currentUser.email).toMatch(/netera@gmail.com/);
});
