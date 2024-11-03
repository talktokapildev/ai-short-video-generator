"use client";
import React, { useContext, useState, useEffect } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "@/components/ui/button";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { VideoDataContext } from "@/app/_context/VideoDataContext";
import { db } from "@/configs/db";
import { Users, VideoData } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";
import CustomLoading from "./_components/CustomLoading";
import { v4 as uuidv4 } from "uuid";
import PlayerDialog from "../_components/PlayerDialog";

function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState();
  const [playVideo, setPlayVideo] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const { user } = useUser();
  const [videoId, setVideoid] = useState();
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const [videoScript, setVideoScript] = useState();

  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onCreateClickHandler = () => {
    console.log(userDetail);
    if (userDetail?.credits <= 0) {
      toast.error("You don't have enough Credits");
      return;
    }
    GetVideoScript();
  };

  const GetVideoScript = async () => {
    setLoading(true);
    const prompt =
      // biome-ignore lint/style/useTemplate: <explanation>
      "Write a script to generate " +
      formData.duration +
      " video on topic : " +
      formData.topic +
      " along with AI image prompt in " +
      formData.imageStyle +
      " format for each scene and give me result in JSON format with imagePrompt and ContentText as field, No Plain text";
    console.log(prompt);

    const resp = await axios.post("/api/get-video-script", {
      prompt: prompt,
    });
    if (resp.data.result) {
      setVideoData((prev) => ({
        ...prev,
        videoScript: resp.data.result,
      }));
      setVideoScript(resp.data.result);
      console.log(resp.data.result);
      await GenerateAudioFile(resp.data.result);
    } else {
      toast("Server Side Error: Refresh screena and Try again");
    }
  };

  const GenerateAudioFile = async (videoScriptData) => {
    setLoading(true);
    let script = "";
    const id = uuidv4();
    // biome-ignore lint/complexity/noForEach: <explanation>
    videoScriptData.forEach((item) => {
      // biome-ignore lint/style/useTemplate: <explanation>
      script = script + item.ContentText + " ";
    });

    const resp = await axios.post("/api/generate-audio", {
      text: script,
      id: id,
    });
    setVideoData((prev) => ({
      ...prev,
      audioFileUrl: resp.data.result,
    }));
    setAudioFileUrl(resp.data.result); //Get File URL
    console.log(resp.data.result);
    resp.data.result &&
      (await GenerateAudioCaption(resp.data.result, videoScriptData));
  };

  const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
    setLoading(true);
    console.log(fileUrl);
    const resp = await axios.post("/api/generate-caption", {
      audioFileUrl: fileUrl,
    });
    setCaptions(resp?.data?.result);
    setVideoData((prev) => ({
      ...prev,
      captions: resp.data.result,
    }));
    resp.data.result && (await GenerateImage(videoScriptData));
  };

  const GenerateImage = async (videoScriptData) => {
    // biome-ignore lint/style/useConst: <explanation>
    let images = [];

    for (const element of videoScriptData) {
      try {
        const resp = await axios.post("/api/generate-image", {
          prompt: element.imagePrompt,
        });
        console.log(resp.data.result);
        images.push(resp.data.result);
      } catch (e) {
        console.log(`Error:${e}`);
      }
    }
    setVideoData((prev) => ({
      ...prev,
      imageList: images,
    }));
    setImageList(images);
    setLoading(false);
  };

  useEffect(() => {
    if (videoData && Object?.keys(videoData)?.length === 4) {
      SaveVideoData(videoData);
    }
  }, [videoData]);

  const SaveVideoData = async (videoData) => {
    setLoading(true);
    console.log(videoData);
    const result = await db
      .insert(VideoData)
      .values({
        script: videoData?.videoScript,
        audioFileUrl: videoData?.audioFileUrl ?? "",
        captions: videoData?.captions ?? "",
        imageList: videoData?.imageList ?? [],
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: VideoData?.id });

    await UpdateUserCredits();
    setVideoid(result[0].id);
    setPlayVideo(true);
    console.log(result);
    setLoading(false);
  };

  /**
   * Used to update user credits
   */
  const UpdateUserCredits = async () => {
    const result = await db
      .update(Users)
      .set({
        credits: userDetail?.credits - 10,
      })
      .where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress));
    console.log(result);
    setUserDetail((prev) => ({
      ...prev,
      credits: userDetail?.credits - 10,
    }));
  };

  return (
    <div className="px-20">
      <h2 className="font-bold text-4xl text-primary text-center">
        Create New
      </h2>
      <div className="mt-10 shadow-md p-10">
        {/* select topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />
        {/* select style */}
        <SelectStyle onUserSelect={onHandleInputChange} />
        {/* Duration  */}
        <SelectDuration onUserSelect={onHandleInputChange} />
        {/* create button */}
        <Button className="mt-10 w-full" onClick={onCreateClickHandler}>
          Create Short Video
        </Button>
      </div>
      <CustomLoading loading={loading} />
      <PlayerDialog playVideo={playVideo} videoId={videoId} />
    </div>
  );
}

export default CreateNew;
