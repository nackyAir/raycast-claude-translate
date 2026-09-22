import { Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import { getTranslatePreferences } from "./lib/preferences";
import { translateText } from "./lib/translate";
import { showTranslateErrorToast } from "./utils/error-toast";

export default async function Command() {
  const clipboardText = await Clipboard.readText();

  if (!clipboardText || !clipboardText.trim()) {
    await showHUD("クリップボードが空だよ");
    return;
  }

  const { targetLanguage } = getTranslatePreferences();
  const toast = await showToast({ style: Toast.Style.Animated, title: "翻訳中..." });

  try {
    const translation = await translateText({ text: clipboardText, targetLanguage });
    await Clipboard.copy(translation);
    await toast.hide();
    await showHUD("翻訳をコピーしたよ");
  } catch (error) {
    await toast.hide();
    await showTranslateErrorToast(error);
  }
}
