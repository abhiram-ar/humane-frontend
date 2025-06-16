import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";

const PostShimmer = () => {
  return (
    <div className="flex gap-3 px-4 pt-4 text-transparent">
      <div className="cursor-pointer">
        <Skeleton className="size-10 animate-pulse rounded-full" />
      </div>
      <div className="w-full">
        {/* post meta */}
        <div className="flex">
          <Skeleton className="cursor-pointer font-semibold hover:underline">No name user</Skeleton>
          <span className="flex animate-pulse text-zinc-400">
            <Dot />
            <Skeleton className="text-transparent">Public</Skeleton>
            <Dot />
            <Skeleton className="text-transparent">time ago</Skeleton>
          </span>
        </div>

        {/* post content*/}

        <Skeleton className="mt-3">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus accusantium
        </Skeleton>
        <Skeleton className="mt-1 w-fit">
          Lorem, ipsum dolor sit amet consectetur adipisicing
        </Skeleton>
        {Math.random() > 0.5 && (
          <Skeleton className="mt-1 w-fit">
            Lorem, ipsum dolor sit amet consectetur adipisicing ANd thsi is
          </Skeleton>
        )}

        {/* img shimmer */}
        {Math.random() > 0.8 && <Skeleton className="mt-3 h-120 w-full" />}
      </div>
    </div>
  );
};

export default PostShimmer;
