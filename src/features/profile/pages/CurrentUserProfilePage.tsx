import { Cake, Calendar } from "lucide-react";
import CoverPhoto from "../components/CoverPhoto";
import EditProfileButton from "../components/EditProfileButton";
import ProfilePic from "../components/ProfilePic";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type FetchUserProfileResponse = {
  success: boolean;
  message: string;
  data: {
    profile: {
      firstName: string;
      lastName?: string;
      bio?: string;
      avatarId?: string;
      coverPhoto?: string;
      createdAt: string;
      humaneScore: number;
    };
  };
};

const fetchUserProfile = async () => {
  const res = await api.get<FetchUserProfileResponse>("/api/v1/anon/profile/");
  return res.data.data.profile;
};

const CurrentUserProfilePage = () => {
  const circleCount = 102;

  const { data, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });

  if (!data) {
    return <div>loading</div>;
  }

  console.log(data);

  return (
    <div className="relative h-screen border border-red-300 xl:me-90">
      <CoverPhoto url={data?.coverPhoto} />

      <div className="px-10">
        <div className="relative flex h-fit w-full justify-between border">
          <div className="relative bottom-25 -mb-25 h-fit">
            <ProfilePic url={data?.avatarId} />
          </div>

          <div className="p-5">
            <EditProfileButton
              nameAndBio={{ firstName: data.firstName, lastName: data.lastName, bio: data.bio }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-lg text-white">
            <div>
              <h3 className="text-2xl font-bold">
                {data?.firstName} {data?.lastName}
              </h3>
              <h5 className="text-pop-green">Humane score: {data?.humaneScore}</h5>

              <div className="flex gap-5">
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

            <p>
              <span className="text-pop-green">{circleCount}</span> humans in circle
            </p>
          </div>
          <div>
            {data.bio ? (
              <p className="mt-5 text-lg text-white">{data?.bio}</p>
            ) : (
              <p className="text-green-subtle/50 quote font-normal italic">
                (Let the world know who you are — add a short bio to your profile.)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentUserProfilePage;
