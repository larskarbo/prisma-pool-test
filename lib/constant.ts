import { toNumber } from "lodash";

export const nameToFetch = "Some One 95000";

export const connectionLimit = toNumber(process.env.CONNECTION_LIMIT);

if (isNaN(connectionLimit)) {
  throw new Error("CONNECTION_LIMIT must be set");
}
