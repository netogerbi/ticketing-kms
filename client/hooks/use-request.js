import axios from "axios";
import { useState } from "react";

export default ({ url, method, data }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (e) => {
    try {
      setErrors(null);
      const r = await axios({
        url,
        method,
        data,
      });
      return r.data;
    } catch (err) {
      console.log(err.response);

      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.message.map((e) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
