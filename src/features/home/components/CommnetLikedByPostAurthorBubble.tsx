import ProfilePicSmall from "@/components/ProfilePicSmall";
import usePublicUserProfileQuery from "@/features/profile/hooks/usePublicUserProfileQuery";
import React from "react";

const CommentLikedByPostAuthorBubble: React.FC<{ postAuthorId: string }> = ({
  postAuthorId: authorId,
}) => {
  const { user } = usePublicUserProfileQuery(authorId);

  return (
    <div>
      <ProfilePicSmall className="max-h-6 max-w-6" avatarURL={user?.avatarURL} />
    </div>
  );
};

export default CommentLikedByPostAuthorBubble;
