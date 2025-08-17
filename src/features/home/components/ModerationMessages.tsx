import { ModerationStatus } from "humane-common";
import React from "react";

type Props = {
  moderationStatus: (typeof ModerationStatus)[keyof typeof ModerationStatus];
};

const ModerationMessages: React.FC<Props> = ({ moderationStatus }) => {
  return (
    <>
      {moderationStatus === "pending" && (
        <p className="pt-3 text-center text-amber-300 !opacity-100">Checking in progress...</p>
      )}

      {moderationStatus === "notAppropriate" && (
        <p className="pt-3 text-center text-red-400 !opacity-100">
          ⚠️ This content has been flagged as inappropriate.
        </p>
      )}

      {moderationStatus === "failed" && (
        <p className="pt-3 text-center text-amber-300 !opacity-100">
          We couldn't complete the moderation check for this content.
        </p>
      )}
    </>
  );
};

export default ModerationMessages;
