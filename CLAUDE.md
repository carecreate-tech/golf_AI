@AGENTS.md

# Golf AI Project — ゴルフクラブ最適化AIアプリ

## プロジェクト概要

14本のクラブ構成が本当に最適かをAIが分析するWebアプリ。
距離ギャップ・クラブ被りを可視化し、アマチュアゴルファーのクラブ構成を最適化する。

## 技術スタック

- **Frontend**: Next.js (App Router) / TypeScript / Tailwind CSS / shadcn/ui
- **Graph**: Recharts
- **Backend**: Supabase
- **AI**: Claude API (claude-sonnet-4-6)

## ディレクトリ構成

```
/app
  /api/analyze     Claude AI分析エンドポイント
  /api/clubs       クラブCRUD API
  /clubs/new       クラブ登録ページ
  page.tsx         ダッシュボード
/components
  ClubForm.tsx     クラブ登録フォーム
  ClubList.tsx     クラブ一覧
  DistanceChart.tsx 距離グラフ
  AiAnalysisCard.tsx AI分析結果
/lib
  supabase.ts      Supabaseクライアント
  analysis.ts      ルールベース分析ロジック
/types
  club.ts          型定義
/hooks
  useClubs.ts      クラブデータフック
/supabase
  schema.sql       DBスキーマ & サンプルデータ
```

## 環境変数 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

## Supabase テーブル (clubs)

| カラム | 型 | 説明 |
|---|---|---|
| id | uuid | PK |
| name | text | 番手名 |
| distance | integer | 飛距離(yard) |
| loft | numeric | ロフト角(任意) |
| miss_tendency | text | ミス傾向(任意) |
| memo | text | メモ(任意) |
| created_at | timestamptz | 作成日時 |

## 分析ロジック

- 距離ギャップ: クラブ間の差分 >= 15yard → 警告
- クラブ被り: クラブ間の差分 <= 7yard → 警告
- AIが自然文で分析・推奨クラブを提案

## Git 運用ルール

**コードを変更するたびに必ずGitHubにプッシュすること。**

リモート: https://github.com/carecreate-tech/golf_AI.git

```bash
git add <変更ファイル>
git commit -m "feat/fix/docs: 変更内容"
git push origin main
```

### コミットメッセージ規約

- 新機能: `feat: 内容`
- バグ修正: `fix: 内容`
- リファクタリング: `refactor: 内容`
- ドキュメント: `docs: 内容`

### 注意事項

- `.env.local` は絶対にコミットしない
- `node_modules/` はコミットしない
