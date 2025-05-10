import { Cake, Calendar } from "lucide-react";
import CoverPhoto from "../components/CoverPhoto";
import EditProfileButton from "../components/EditProfileButton";
import ProfilePic from "../components/ProfilePic";

const CurrentUserProfilePage = () => {
  const humaneScore = 12000;
  const circleCount = 102;
  return (
    <div className="relative h-screen border border-red-300 xl:me-90">
      <CoverPhoto />

      <div className="px-10">
        <div className="relative flex h-fit w-full justify-between border">
          <div className="relative bottom-25 -mb-25 h-fit">
            <ProfilePic />
          </div>

          <div className="p-5">
            <EditProfileButton />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-lg text-white">
            <div>
              <h3 className="text-2xl font-bold">Satoshi Nakamoto</h3>
              <h5 className="text-pop-green">Humane score: {humaneScore}</h5>

              <div className="flex gap-5">
                <h5 className="flex gap-2 text-zinc-400 items-center">
                  <Cake size={20}/>
                  Born 23 May 1999
                </h5>
                <h5 className="flex gap-2 text-zinc-400 items-center">
                  <Calendar size={20} />
                  Joined May 2017
                </h5>
              </div>
            </div>

            <p>
              <span className="text-pop-green">{circleCount}</span> humans in circle
            </p>
          </div>

          <p className="mt-5 text-lg text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse ut similique dolor laborum
            iure vel voluptatem aspernatur reprehenderit est at veritatis corrupti expedita, unde
            nihil a soluta voluptas libero molestias? Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Esse ut similique dolor laborum iure vel voluptatem aspernatur
            reprehenderit est at veritatis corrupti expedita, unde nihil a soluta voluptas libero
            molestias?
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentUserProfilePage;
