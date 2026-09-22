/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Anthropic API Key - Get one at console.anthropic.com */
  "anthropicApiKey": string,
  /** Model - Claude model to use for translation */
  "model": "claude-opus-5" | "claude-sonnet-5" | "claude-haiku-4-5",
  /** Target Language - Language to translate text into */
  "targetLanguage": "English" | "Japanese" | "Chinese (Simplified)" | "Korean" | "Spanish" | "French" | "German"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `translate` command */
  export type Translate = ExtensionPreferences & {}
  /** Preferences accessible in the `translate-clipboard` command */
  export type TranslateClipboard = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `translate` command */
  export type Translate = {}
  /** Arguments passed to the `translate-clipboard` command */
  export type TranslateClipboard = {}
}

