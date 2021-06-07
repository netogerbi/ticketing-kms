import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
  if (typeof window === "undefined") {
    const r = await axios.get(
      `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser`,
      {
        headers: req.headers,
      }
    );

    return r.data;
  } else {
    const r = await axios.get("/api/users/currentuser");

    return r.data;
  }
};

export default LandingPage;
