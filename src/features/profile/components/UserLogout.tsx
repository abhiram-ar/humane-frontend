import { LogOut } from "lucide-react";
import testProfile from "@/assets/testProfile.png";
import { useState } from "react";

const UserLogout = () => {
  const [showLogo, setShowlogo] = useState(false);
  return (
    <div
      onMouseEnter={() => setShowlogo(true)}
      onMouseLeave={() => setShowlogo(false)}
      className="relative flex cursor-pointer items-center gap-3 rounded-e-2xl px-10 py-3 text-xl transition-all duration-500 ease-out hover:scale-[1.02] hover:bg-zinc-700/50"
    >
      <LogOut
        className={`rotate-180 transform transition-all duration-300 ${showLogo ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
      />

      <div
        className={`flex transform items-center gap-3 transition-all duration-300 ${showLogo ? "translate-x-0 scale-90" : "-translate-x-8"}`}
      >
        <div className="border-grey-light h-10 w-10 overflow-clip rounded-full">
          <img src={testProfile} className="h-full w-full object-cover" alt="profilepic" />
        </div>
        <h2 className={`transition-all duration-300 ${showLogo ? "text-white" : "text-zinc-300"}`}>
          Satoshi
        </h2>
      </div>
    </div>
  );
};

export default UserLogout;
