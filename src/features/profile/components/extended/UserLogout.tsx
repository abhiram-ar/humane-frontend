import { LogOut } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router";
import { useAppDispatch } from "@/features/userAuth/hooks/store.hooks";
import { logout } from "@/features/userAuth/redux/userAuthSlice";
import { api } from "@/lib/axios";
import useCurrentUserProfile from "../../hooks/useCurrentUserProfile";
import usePublicHumaneScoreQuery from "../../../../hooks/usePublicUserHumaneScoreQuery";
import useUserId from "../../../../hooks/useUserId";
import HumaneScoreNumberFlow from "@/components/HumaneScoreNumberFlow";
import ProfilePicSmall from "@/components/ProfilePicSmall";

const UserLogout = () => {
  const [showLogo, setShowlogo] = useState(false);
  const userId = useUserId();
  const { data: humaneScoreData } = usePublicHumaneScoreQuery(userId);
  const { data } = useCurrentUserProfile();

  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const handleLogut = async () => {
    try {
      await api.post("/api/v1/user/auth/logout");
      dispath(logout());
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.error("error while logging out", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <div
          onMouseEnter={() => setShowlogo(true)}
          onMouseLeave={() => setShowlogo(false)}
          className="relative -ms-3 flex cursor-pointer items-center gap-3 rounded-e-2xl py-3 ps-10 text-xl transition-all duration-500 ease-out hover:scale-[1.02] hover:bg-zinc-700/50"
        >
          <LogOut
            className={`rotate-180 transform transition-all duration-300 ${showLogo ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
          />

          <div
            className={`flex transform items-center gap-3 transition-all duration-300 ${showLogo ? "translate-x-0 scale-90" : "-translate-x-8"}`}
          >
            <ProfilePicSmall avatarURL={data?.avatarURL} />

            {data && (
              <div className="text-left">
                <h2
                  className={`transition-all duration-300 ${showLogo ? "text-white" : "text-zinc-300"}`}
                >
                  {data.firstName}
                </h2>

                <HumaneScoreNumberFlow
                  score={humaneScoreData?.score || 0}
                  className="gap-1 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-grey-dark-bg text-almost-white bg-[#272727]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            Once you logged out, and need to login again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer rounded-2xl border-0 text-black hover:bg-white/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogut}
            className="hover:bg-red-blood cursor-pointer rounded-2xl bg-zinc-600 ease-out"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserLogout;
