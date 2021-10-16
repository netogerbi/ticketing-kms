import { useEffect, useState } from "react";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    data: {
      orderId: order.id,
    },
    onSuccess: (p) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLEft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLEft();
    const timerId = setInterval(findTimeLEft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) return <div>Order Expired</div>;

  return (
    <div>
      Time left to pay: {timeLeft}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_l7TQIMCAQQUsEd4zqvxhzH1a"
        amount={order.ticket.price}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
