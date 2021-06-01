import request from "supertest";
import { app } from "../../app";

it("responds with details about current user", async () => {
  const signupCookie = await global.signup();

  const r = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", signupCookie)
    .expect(200);

  expect(r.body.currentUser.email).toMatch(/test@test.com/);
});

it("responds with null if not authenticated", async () => {
  const r = await request(app).get("/api/users/currentuser").expect(200);

  expect(r.body.currentUser).toBeNull();
});
