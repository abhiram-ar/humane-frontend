import { useAppSelector } from "@/features/userAuth/hooks/store.hooks";
import { UserJWTTokenPayload } from "humane-common";
import { jwtDecode } from "jwt-decode";

const useUserId = () => {
  const userToken = useAppSelector((state) => state.userAuth.token);
  let userId: string | undefined;
  if (userToken) {
    const user = jwtDecode<UserJWTTokenPayload>(userToken);
    userId = user.userId;
  }
  return userId;
};

export default useUserId;
