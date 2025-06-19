import ProfilePicSmall from "@/components/ProfilePicSmall";
import React from "react";
import useCurrentUserProfile from "@/features/profile/hooks/useCurrentUserProfile";
import PostAddCommentForm from "./PostAddCommentForm";

const PostAddComment: React.FC<{ postId?: string }> = ({ postId }) => {
  const { data } = useCurrentUserProfile();

  return (
    <div className="text bg-grey-light/20 flex w-full gap-2 p-4">
      <ProfilePicSmall avatarURL={data?.avatarURL} />
      <PostAddCommentForm postId={postId} />
    </div>
  );
};

export default PostAddComment;
