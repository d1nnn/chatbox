import * as ImagePicker from 'expo-image-picker';

export async function chooseImage(): Promise<{ uri: string, fileName: string }> {

  let result = await ImagePicker.launchImageLibraryAsync();

  let source = { uri: "", fileName: "" }

  if (result.assets)
    source = { uri: result!.assets![0].uri as string, fileName: result!.assets![0].fileName as string }

  return source
}
