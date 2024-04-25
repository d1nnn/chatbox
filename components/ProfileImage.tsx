import React from "react";
import { Image } from "react-native";

type ProfileImageType = {
  uri: string,
  width?: number,
  height?: number,
}

const DEFAULT_IMAGE = require("../assets/profilepic.png")

export default function ProfileImage({ uri, width, height }: ProfileImageType): React.JSX.Element {


  return (
    <>
      <Image source={uri === "" ? DEFAULT_IMAGE : { uri }} style={{ width: width ? width : 40, height: height ? height : 40, borderRadius: (width ?? 40) / 2 }} />
    </>
  )
}
