import { api } from "@/lib/axios";
import OverviewCard from "./base/OverviewCard";
import { API_ROUTES } from "@/lib/API_ROUTES";
import { useQuery } from "@tanstack/react-query";
import NumberFlow from "@number-flow/react";
import { findChange } from "@/lib/findChange";
import { GetPostStatsResponse } from "../types/GetPostsStatResponse";

const PostOverviewContainer = () => {
  const { data } = useQuery({
    queryKey: ["admin-posts-stats"],
    queryFn: async () => {
      const res = await api.get<GetPostStatsResponse>(`${API_ROUTES.WRITER_ROUTE}/admin/stats`);
      return res.data.data;
    },
  });

  return (
    <>
      <OverviewCard title="Posts in Last 24hrs">
        <div className="mx-auto flex flex-col justify-center">
          <NumberFlow
            className="text-2xl font-bold"
            value={data?.newPosts.newPostInLast24hrs || 0}
          />
          <p className="text-zinc-400">
            {findChange(
              data?.newPosts.newPostInLast24hrs || 0,
              (data?.newPosts.newPostInLast48hrs || 0) - (data?.newPosts.newPostInLast24hrs || 0),
            )}{" "}
            from yesterday
          </p>
        </div>
      </OverviewCard>
      <OverviewCard title="Total Posts">
        <NumberFlow className="text-2xl font-bold" value={data?.totalPosts || 0} />
      </OverviewCard>
      <OverviewCard title="User Reports">
        <p className="h-20">Hi</p>
      </OverviewCard>
    </>
  );
};

export default PostOverviewContainer;
