import client from "../api/client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return currentUser ? <h1>Signed In</h1> : <h1>NOT Signed In</h1>;
};

LandingPage.getInitialProps = async (context) => {
  return {};
  // const cli = client(context);
  // const { data } = await cli.get("/api/users/currentuser");
  // return data;
};

export default LandingPage;
