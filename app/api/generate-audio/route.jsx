import { storage } from "@/configs/firebaseConfig";
import textToSpeech from "@google-cloud/text-to-speech";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse } from "next/server";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const fs = require("fs");
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
const util = require("util");

const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();

  // biome-ignore lint/style/useTemplate: <explanation>
  const storageRef = ref(storage, "ai-short-video-files/" + id + ".mp3");

  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  const audioBuffer = Buffer.from(response.audioContent, "binary");

  await uploadBytes(storageRef, audioBuffer, { contentType: "audio/mp3" });

  const downloadUrl = await getDownloadURL(storageRef);
  console.log(downloadUrl);
  return NextResponse.json({ result: downloadUrl });
}
