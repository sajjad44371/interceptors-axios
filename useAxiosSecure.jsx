// inside custom hook

import { useEffect } from "react";

const { default: axios } = require("axios");

const instance = axios.create({
  baseURL: "http://localhost3000",
});

const useAxiosSecure = () => {
  useEffect(() => {
    // interceptor for request

    const reqInterceptor = instance.interceptors.request.use((config) => {
      const token = user.accessToken;
      if (token) {
        config.headers.authorization = `Bearer ${user.token}`;
      }
      return config;
    });

    // interceptor for response
    const resInterceptor = instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
          signOutUser().then(() => {
            navigate("/register");
          });
        }
      },
    );

    return () => {
      instance.interceptors.request.eject(reqInterceptor);
      instance.interceptors.response.eject(resInterceptor);
    };
  }, [user, signOutUser, navigate]);

  return instance;
};

export default useAxiosSecure;

// use: in frontend
useAxiosSecure.post("/products", newProduct).then((data) => {
  console.log(data.data);
});

// in the server
// middleware:
const verifyFBToken = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.token_email = decoded.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized access" });
  }
};
