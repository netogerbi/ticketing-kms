import client from "../api/client";

const LandingPage = ({ currentUser, tickets }) => {
  console.log(tickets);
  return currentUser ? <h1>Signed In</h1> : <h1>NOT Signed In</h1>;
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
