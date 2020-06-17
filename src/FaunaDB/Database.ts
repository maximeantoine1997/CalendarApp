import faunadb, { query as q } from "faunadb";

//old
let secret1 = process.env.REACT_APP_FAUNADB_API_KEY1 || "";

//new
let secret2 = process.env.REACT_APP_FAUNADB_API_KEY2 || "";
// const user = localStorage.getItem("authUser");
// if (user) {
//    secret = JSON.parse(user).secret;
//    console.log(secret);
// }

const client = new faunadb.Client({ secret: secret2 });
const old = new faunadb.Client({ secret: secret1 });

export { client, q, old };
