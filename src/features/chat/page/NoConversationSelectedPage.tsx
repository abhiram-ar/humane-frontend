import React from "react";

const NoConversationSelectedPage: React.FC = () => {
  return (
    <>
      <div className="bg-grey-dark-bg flex h-screen w-full items-center justify-center">
        <div className="-mt-30 text-center">
          <p className="text-offwhite mb-5 text-xl">Select a conversation</p>
        </div>
      </div>
    </>
  );
};

export default NoConversationSelectedPage;
