import faunadb, { query as q } from "faunadb";

let secret = process.env.REACT_APP_FAUNADB_API_KEY || "";
// const user = localStorage.getItem("authUser");
// if (user) {
//    secret = JSON.parse(user).secret;
//    console.log(secret);
// }

const client = new faunadb.Client({ secret });

export { client, q };
