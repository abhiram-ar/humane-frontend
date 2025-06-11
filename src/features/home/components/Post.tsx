import ProfilePicSmall from "@/features/notification/Components/ProfilePicSmall";
import React from "react";
import prc from "@/assets/testProfile.png";
import { Dot } from "lucide-react";
import { Link } from "react-router";

const Post = () => {
  return (
    <div className="flex gap-3 p-4 text-white">
      <div>
        <ProfilePicSmall avatarURL={prc} />
      </div>
      <div>
        <div className="flex">
          <Link to="#" className="font-semibold hover:underline ">Satoshi Natomoto</Link> <Dot />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. A dolorem velit soluta sed hic?
          Fuga obcaecati perspiciatis corrupti id! Provident, repudiandae veniam! Sunt modi suscipit
          at non maxime autem doloremque.
        </p>
      </div>
    </div>
  );
};

export default Post;
