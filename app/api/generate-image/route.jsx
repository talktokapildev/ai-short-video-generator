import { storage } from "@/configs/firebaseConfig";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextResponse } from "next/server";
import Replicate from "replicate";
export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const input = {
      prompt: prompt,
      height: 1280,
      width: 1024,
      num_outputs: 1,
    };

    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      { input }
    );

    //Save to Firebase
    const base64Image =
      // biome-ignore lint/style/useTemplate: <explanation>
      "data:image/png;base64," + (await ConvertImage(output[0]));
    // biome-ignore lint/style/useTemplate: <explanation>
    const fileName = "ai-short-video-files/" + Date.now() + ".png";
    const storageRef = ref(storage, fileName);

    await uploadString(storageRef, base64Image, "data_url");

    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    return NextResponse.json({ result: downloadUrl });
    //=> ["https://replicate.delivery/yhqm/VyD24fDyzM2nQSg0nQc58W2...
  } catch (e) {
    return NextResponse.json({ error: e });
  }
}

const ConvertImage = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const base64Image = Buffer.from(resp.data).toString("base64");
    return base64Image;
  } catch (e) {
    console.log("Error:", e);
  }
};
