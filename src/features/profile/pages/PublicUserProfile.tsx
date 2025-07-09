import CoverPhoto from "../components/base/CoverPhoto";
import ProfilePic from "../components/base/ProfilePic";
import { Calendar } from "lucide-react";
import { useParams } from "react-router";
import PageNotFound from "@/layout/PageNotFoundPage";
import usePublicUserProfileQuery from "../hooks/usePublicUserProfileQuery";
import { Skeleton } from "@/components/ui/skeleton";
import RelationshipActions from "../components/extended/RelationshipActions";
import UserMutualFriends from "../components/extended/UserMutualFriends.trigger";
import Friends from "../components/extended/Friends.trigger";
import ProfilePostList from "../components/extended/ProfilePostList";
import HumaneScoreNumberFlow from "@/components/HumaneScoreNumberFlow";

const PubliicUserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { isError, user, httpStatus } = usePublicUserProfileQuery(userId);

  if (!userId || (httpStatus && httpStatus === 404))
    return <PageNotFound message="User not found ❌" />;

  if (isError) return <PageNotFound message="Something went wrong" />;

  return (
    <div className="relative min-h-screen border-x border-zinc-400/50 xl:me-90">
      <CoverPhoto url={user?.coverPhotoURL} />

      <div className="px-10">
        <div className="relative flex h-fit w-full justify-between">
          <div className="relative bottom-25 -mb-25 h-fit">
            <ProfilePic url={user?.avatarURL} />
          </div>

          <div className="py-5">
            <RelationshipActions userId={userId} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-lg text-white">
            {/* below profile pic */}

            {user ? (
              <>
                <div>
                  <h3
                    className={`text-2xl font-bold`}
                  >{`${user.firstName} ${user.lastName || ""}`}</h3>

                  <div className="text-pop-green flex items-center">
                    Humane score:
                    <HumaneScoreNumberFlow
                      score={user.humaneScore || 0}
                      className="ms-0.5 h-7 gap-0.5 text-lg"
                    />
                  </div>

                  <div className="mt-3 flex gap-5">
                    {/* TODO: date */}
                    {/* <h5 className="flex items-center gap-2 text-zinc-400">
                      <Cake size={20} />
                      Born 23 May 1999
                    </h5> */}
                    <h5 className="flex items-center gap-2 text-zinc-400">
                      <Calendar size={20} />
                      Joined{" "}
                      {user.createdAt &&
                        new Date(user.createdAt).toLocaleString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                    </h5>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <Skeleton className="my-1 h-5 w-52" />
                <Skeleton className="my-1 h-5 w-30" />
                <Skeleton className="my-3 h-5 w-52" />
              </div>
            )}

            {/* opposite side to profile pic  */}
            <div className="text-end">
              <Friends userId={userId} />
              <UserMutualFriends userId={userId} />
            </div>
          </div>
          <div className="mt-3">
            {user?.bio && <pre className="font-sans text-lg text-wrap text-white">{user.bio}</pre>}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-zinc-400/50">
        {user && <ProfilePostList userId={user.id} />}
      </div>
    </div>
  );
};

export default PubliicUserProfile;
