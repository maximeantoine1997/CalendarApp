import React, { useState } from "react";
import SignIn from "./NotAuth/SignIn";
import SignUp from "./NotAuth/SignUp";

const NotAuthApp: React.FC = () => {
   const [isSignIn, setIsSignIn] = useState(true);
   if (isSignIn) {
      return <SignIn onChange={() => setIsSignIn(false)} />;
   }
   return <SignUp onChange={() => setIsSignIn(true)} />;
};

export default NotAuthApp;
