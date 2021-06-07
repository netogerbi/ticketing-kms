import client from "../api/client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const cli = client(context);
  const { data } = await cli.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
