import CoverPhoto from "../components/CoverPhoto";
import ProfilePic from "../components/ProfilePic";
import testProfile from "@/assets/testProfile.png";
import testCover from "@/assets/testCover.png";
import { Calendar } from "lucide-react";

const PubliicUserProfile = () => {
  const circleCount = 102;
  const mututal = 12;
  let relationShipStatus: "stranger" | "requested" | "friends" = "friends"


  const data = {
    firstName: "Satoshi",
    lastName: "kwan",
    createdAt: new Date(),
    humaneScore: 1000,
    bio:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem natus deserunt?" +
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem natus deserunt?",
  };

  return (
    <div className="relative h-screen border-x border-zinc-400/50 xl:me-90">
      <CoverPhoto url={testCover} />

      <div className="px-10">
        <div className="relative flex h-fit w-full justify-between">
          <div className="relative bottom-25 -mb-25 h-fit">
            <ProfilePic url={testProfile} />
          </div>

          <div className="py-5">
            {relationShipStatus === "stranger" && (
              <button className="bg-pop-green/95 hover:bg-pop-green cursor-pointer rounded-full px-4 py-1 font-semibold text-black">
                Add to circle{" "}
              </button>
            )}
            {relationShipStatus === "requested" && (
              <button className="bg-offwhite cursor-pointer rounded-full px-4 py-1 font-semibold text-black hover:bg-white">
                Requested
              </button>
            )}

            {relationShipStatus === "friends" && (
              <button className="cursor-pointer rounded-full bg-zinc-400/90 px-4 py-1 font-semibold text-black hover:bg-zinc-400">
                Remove from circle
              </button>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-lg text-white">
            {/* below profile pic */}
            <div>
              <h3 className="text-2xl font-bold">
                {data?.firstName} {data?.lastName}
              </h3>
              <h5 className="text-pop-green">Humane score: {data?.humaneScore}</h5>

              <div className="mt-3 flex gap-5">
                {/* Todo: date */}
                {/* <h5 className="flex items-center gap-2 text-zinc-400">
                  <Cake size={20} />
                  Born 23 May 1999
                </h5> */}
                <h5 className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={20} />
                  Joined{" "}
                  {data?.createdAt &&
                    new Date(data.createdAt).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                </h5>
              </div>
            </div>

            {/* opposite side to profile pic  */}
            <div className="text-end">
              <p>
                <span className="text-pop-green">{circleCount}</span> humans in circle
              </p>
              <p>
                <span className="text-pop-green">{mututal}</span> mutual
              </p>
            </div>
          </div>
          <div className="mt-3">
            {data.bio && <pre className="font-sans text-lg text-wrap text-white">{data?.bio}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PubliicUserProfile;
