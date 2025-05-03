import React from "react";
import Signup from "../components/Singup";
import { Link } from "react-router";

const SignupPage = () => {
  return (
    <div>
      <h2 className="text-offwhite text-center text-2xl font-semibold mb-5">
        Signup and share your humanity
      </h2>
      <Signup />

      <p className="text-offwhite pt-2 text-center">
        Already have an account? <Link to="/auth/login" className="underline">login</Link>
      </p>
    </div>
  );
};

export default SignupPage;
