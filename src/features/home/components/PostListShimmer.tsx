import React from "react";
import PostShimmer from "./PostShimmer";

const PostListShimmer: React.FC<{ size?: number }> = ({ size = 6 }) => {
  return Array(size)
    .fill(0)
    .map((_, i) => (
      <div key={i} className="border-b border-zinc-400/50 pb-4">
        <PostShimmer />
      </div>
    ));
};

export default PostListShimmer;
