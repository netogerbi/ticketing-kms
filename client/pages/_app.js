import "bootstrap/dist/css/bootstrap.css";
import client from "../api/client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div className="">
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const cli = client(appContext.ctx);
  const { data } = await cli.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default AppComponent;
