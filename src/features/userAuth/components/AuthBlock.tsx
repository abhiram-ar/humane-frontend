import React from "react";

const AuthBlock = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-[#5b5b5b] px-8 py-10 rounded-md" >{children}</div>;
};

export default AuthBlock;
