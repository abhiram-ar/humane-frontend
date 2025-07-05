export type PublicUserProfile = {
  id: string;
  firstName: string;
  lastName?: string | null;
  bio?: string | null;
  createdAt: string;
  avatarURL?: string;
  coverPhotoURL?: string;
  humaneScore: number;
};

export type GetPublicUserProfileResponse = {
  success: boolean;
  message: string;
  data: { user: PublicUserProfile };
};
