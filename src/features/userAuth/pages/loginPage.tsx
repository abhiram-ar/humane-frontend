import { Link } from "react-router";
import Login from "../components/Login";

const LoginPage = () => {
  return (
    <div>
      <h2 className="text-offwhite mb-5 text-center text-2xl font-semibold">
        Login to your human side
      </h2>
      <Login />
      <p className="text-offwhite pt-2 text-center">
        Don't have an account? <Link to="/signup" className="underline">Signup</Link>
      </p>
    </div>
  );
};

export default LoginPage;
