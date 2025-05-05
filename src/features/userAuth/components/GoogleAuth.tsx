import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from "@react-oauth/google";

const SignInWithGoogle: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log(credentialResponse);
  };

  return (
    <>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        onScriptLoadSuccess={() => setLoading(false)}
      >
        {!loading ? (
          <div className="flex items-center justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_black" width={"320px"} />
          </div>
        ) : (
          <div className="rounded-base mx-auto flex w-fit items-center justify-center gap-3 border border-black bg-[#d9d9d9] px-3 py-2 hover:bg-[#bababa] active:bg-zinc-400">
            {/* <GoogleIcon /> */}

            <button className="font-medium">SignIn with Google</button>
          </div>
        )}
      </GoogleOAuthProvider>
    </>
  );
};

export default SignInWithGoogle;
