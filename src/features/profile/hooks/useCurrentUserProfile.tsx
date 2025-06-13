import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../services/fetchUserProfile.service";

const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });
};

export default useCurrentUserProfile;
