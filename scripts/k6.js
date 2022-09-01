import { check } from "k6";
import http from "k6/http";

const url_base = "http://localhost:3000/api/getUserPg?name=Some%20One%2095000";

export const options = {
  stages: [
    { duration: "1s", target: 500 },
    { duration: "5s", target: 500 },
    { duration: "1s", target: 0 },
  ],
};

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.get(url_base, params);
  check(res, { "status was 200": (r) => r.status == 200 });
}
