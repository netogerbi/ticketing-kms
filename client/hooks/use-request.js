import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, data, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (e) => {
    try {
      setErrors(null);
      const r = await axios({
        url,
        method,
        data,
      });

      if (onSuccess) {
        onSuccess(r.data);
      }

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

export default useRequest;
