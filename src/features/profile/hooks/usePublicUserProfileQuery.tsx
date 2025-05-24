import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { PublicUserProfile } from "../Types/GetPublicUserProfileResponse";
import { getPublicUserProfie } from "../services/fetchPublicUserProfile.service";

const usePublicUserProfileQuery = (id: string | undefined) => {
  const [user, setUser] = useState<PublicUserProfile | null>(null);
  const [httpStatus, setHTTPStatus] = useState<number | null>(null);

  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getPublicUserProfie(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (res?.data?.data?.user) {
      setUser(res.data.data.user);
    }
    if (res?.status) {
      setHTTPStatus(res.status);
    }
  }, [res, setUser]);

  return { user, isLoading, isError, httpStatus };
};

export default usePublicUserProfileQuery;
