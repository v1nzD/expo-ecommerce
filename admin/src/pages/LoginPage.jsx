import { SignIn } from "@clerk/clerk-react";
import React from "react";

const LoginPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <SignIn />
    </div>
  );
};

export default LoginPage;
