"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import EmptyState from "./_components/EmptyState";
import { VideoDataContext } from "../_context/VideoDataContext";
import { db } from "@/configs/db";
import { VideoData } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import VideoList from "./_components/VideoList";

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const { user } = useUser();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  useEffect(() => {
    user && GetVideoList();
  }, [user]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setVideoData(null); // Make Sure it will Null before creating the new Video
  }, []);
  /**
   * Used to Get Users Video
   */
  const GetVideoList = async () => {
    const result = await db
      .select()
      .from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(VideoData.id));
    console.log(result);
    setVideoList(result);
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>

        <Link href={"/dashboard/create-new"}>
          <Button>+ Create New</Button>
        </Link>
      </div>

      {/* Empty State  */}
      {videoList?.length === 0 && (
        <div>
          <EmptyState />
        </div>
      )}

      {/* List of Videos  */}
      <VideoList videoList={videoList} />
    </div>
  );
}

export default Dashboard;
