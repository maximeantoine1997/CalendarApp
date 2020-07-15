import faunadb, { query as q } from "faunadb";

const secret = process.env.REACT_APP_FAUNADB_API_KEY || "";

const client = new faunadb.Client({ secret: secret });

export { client, q };
