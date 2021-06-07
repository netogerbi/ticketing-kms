import client from "../api/client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await client(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
