import CoverPhoto from "../components/CoverPhoto";
import ProfilePic from "../components/ProfilePic";
import testProfile from "@/assets/testProfile.png";
import testCover from "@/assets/testCover.png";
import { Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useParams } from "react-router";
import PageNotFound from "@/layout/PageNotFoundPage";
import { GetPublicUserProfileResponse } from "../Types/GetPublicUserProfileResponse";

const circleCount = 102;
const mututal = 12;
let relationShipStatus: "stranger" | "requested" | "friends" = "friends";

// const data = {
//   firstName: "Satoshi",
//   lastName: "kwan",
//   createdAt: new Date(),
//   humaneScore: 1000,
//   bio:
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem natus deserunt?" +
//     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis exercitationem natus deserunt?",
// };

const getPublicUserProfie = async (userId: string) => {
  const res = await api.get<GetPublicUserProfileResponse>(`/api/v1/query/public/user/${userId}`);
  return res.data.data;
};

const PubliicUserProfile = () => {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getPublicUserProfie(id!),
    enabled: !!id,
  });
  // if (!id) return <PageNotFound />;

  console.log(id, data);

  return (
    <div className="relative h-screen border-x border-zinc-400/50 xl:me-90">
      <CoverPhoto url={data?.user.coverPhotoURL} />

      <div className="px-10">
        <div className="relative flex h-fit w-full justify-between">
          <div className="relative bottom-25 -mb-25 h-fit">
            <ProfilePic url={data?.user.avatarURL} />
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
                {data?.user.firstName} {data?.user.lastName}
              </h3>
              <h5 className="text-pop-green">Humane score: {1000}</h5>

              <div className="mt-3 flex gap-5">
                {/* Todo: date */}
                {/* <h5 className="flex items-center gap-2 text-zinc-400">
                  <Cake size={20} />
                  Born 23 May 1999
                </h5> */}
                <h5 className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={20} />
                  Joined{" "}
                  {data?.user.createdAt &&
                    new Date(data.user.createdAt).toLocaleString("en-US", {
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
            {data?.user.bio && (
              <pre className="font-sans text-lg text-wrap text-white">{data?.user.bio}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PubliicUserProfile;
