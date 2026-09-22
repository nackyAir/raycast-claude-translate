# Claude Translate (Raycast)

Claude API でテキストを翻訳するローカル用 Raycast Extension。

## Setup

```bash
npm install
npm run dev   # 初回のみ。Raycast に Extension が登録される（Ctrl+C で止めて OK）
```

Raycast の Extension 設定（`⌘ ,` → Extensions → Claude Translate）で以下を設定:

- Anthropic API Key（必須）
- Model: Claude Opus 5 / Sonnet 5 / Haiku 4.5（デフォルト Opus 5）
- Target Language（デフォルト English）

## Commands

- `Translate`: テキストを入力 → 翻訳結果を表示。コピー / 前面アプリに貼り付け / もう一度（⌘R）
- `Translate Clipboard`: クリップボードの内容を翻訳してクリップボードに上書き
