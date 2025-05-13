import { LogOut, User } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile.service";

const UserLogout = () => {
  const [showLogo, setShowlogo] = useState(false);
  const [isProfilePicLoading, setProfilePicLoading] = useState(true);

  const navigate = useNavigate();
  const dispath = useAppDispatch();

  const { data } = useQuery({ queryKey: ["user-profile"], queryFn: fetchUserProfile });

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
          className="relative -ms-3 flex cursor-pointer items-center gap-3 rounded-e-2xl px-10 py-3 text-xl transition-all duration-500 ease-out hover:scale-[1.02] hover:bg-zinc-700/50"
        >
          <LogOut
            className={`rotate-180 transform transition-all duration-300 ${showLogo ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
          />

          <div
            className={`flex transform items-center gap-3 transition-all duration-300 ${showLogo ? "translate-x-0 scale-90" : "-translate-x-8"}`}
          >
            {data?.avatarURL ? (
              <div className="border-grey-light relative h-10 w-10 overflow-clip rounded-full">
                {isProfilePicLoading && (
                  <div className="absolute inset-0 animate-pulse bg-zinc-400"></div>
                )}
                <img
                  src={data?.avatarURL}
                  className={`h-full w-full object-cover transition-all duration-100 ease-in ${isProfilePicLoading ? "scale-102 opacity-0" : "scale-100 opacity-100"} `}
                  alt="profilepic"
                  onLoad={() => setProfilePicLoading(false)}
                />
              </div>
            ) : (
              <div className="border-grey-light text-offwhite relative flex h-10 w-10 items-center justify-center overflow-clip rounded-full border bg-zinc-600/50">
                <User />
              </div>
            )}
            <h2
              className={`transition-all duration-300 ${showLogo ? "text-white" : "text-zinc-300"}`}
            >
              {data?.firstName}
            </h2>
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
