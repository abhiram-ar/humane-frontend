import { Calendar } from "lucide-react";
import EditProfileButton from "../components/extended/EditProfileButton";
import ProfilePicConfig from "../components/extended/ProfilePicConfig";
import CoverPhotoConfig from "../components/extended/CoverPhotoConfig";
import useUserId from "../hooks/useUserId";
import PendingFriendRequests from "../components/extended/PendingFriends.trigger";
import Friends from "../components/extended/Friends.trigger";
import ProfilePostList from "../components/extended/ProfilePostList";
import useCurrentUserProfile from "../hooks/useCurrentUserProfile";
import useRestoreScrollPosition from "@/hooks/useRestoreScrollPosition";

const CurrentUserProfilePage = () => {
  const { data } = useCurrentUserProfile();
  useRestoreScrollPosition();

  const userId = useUserId();

  if (!data) {
    return <div>loading</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative w-full border-x border-b border-zinc-400/50">
        <CoverPhotoConfig />

        <div className="px-10">
          <div className="relative flex h-fit w-full justify-between">
            <div className="relative bottom-25 -mb-25 h-fit">
              <ProfilePicConfig />
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
              {userId && (
                <div className="flex flex-col text-right">
                  <Friends userId={userId} />
                  <PendingFriendRequests userId={userId} />
                </div>
              )}
            </div>
            <div className="mt-3">
              {data.bio ? (
                <pre className="font-sans text-lg text-wrap text-white">{data?.bio}</pre>
              ) : (
                <p className="text-green-subtle/50 quote font-normal italic">
                  (Let the world know who you are — add a short bio to your profile.)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* posts */}
        <div className="text-pop-green bg-grey-dark-bg/50 sticky top-0 z-20 mt-5 border-b border-zinc-400/50 py-5 text-center text-xl backdrop-blur-lg">
          #My posts
        </div>

        <div>{userId && <ProfilePostList userId={userId} className="sm:px-5 xl:px-10" />}</div>
      </div>

      {/* dummy for centering */}
      <div className="xl:w-150"></div>
    </div>
  );
};

export default CurrentUserProfilePage;
