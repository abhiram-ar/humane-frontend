import { InfiniteData } from "@tanstack/react-query";
import { GetUserPostTimelineResponse } from "./GetUserTimelineResponse";

export type InfiniteTimelineData = InfiniteData<GetUserPostTimelineResponse["data"], unknown> | undefined;