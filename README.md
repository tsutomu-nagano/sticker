# メタデータ集約アプリ

v0 で作成した Next.js アプリケーションです。統計表の分類事項・集計事項をノードベースで可視化・管理する UI を提供します。

## 技術スタック

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Flow
- pnpm 10.15.0
- Docker / Docker Compose

## 起動方法

このプロジェクトは Docker Compose で起動します。ローカルに Node.js や pnpm を直接インストールする必要はありません。

```bash
docker compose up --build -d
```

起動後、ブラウザで以下にアクセスしてください。

```text
http://127.0.0.1:5174
```

## ログ確認

```bash
docker compose logs -f web
```

## 停止方法

```bash
docker compose down
```

## 開発メモ

- 開発サーバーはコンテナ内で `pnpm dev --hostname 0.0.0.0 --port 5174` を実行します。
- ホスト側のソースコードは `/app` にマウントされるため、ファイル変更は開発サーバーに反映されます。
- `node_modules` と `.next` は Docker volume として管理しています。
- `package.json` と `pnpm-lock.yaml` に不整合があるため、Dockerfile では `pnpm install --no-frozen-lockfile` を使用しています。
- pnpm 11 系の build script 承認挙動を避けるため、`packageManager` と Dockerfile で pnpm 10.15.0 を固定しています。

## 主なファイル

- `app/`: Next.js App Router のページ・レイアウト
- `components/`: UI コンポーネント
- `hooks/`: React hooks
- `lib/`: ユーティリティ
- `public/`: 静的ファイル
- `Dockerfile`: アプリケーション用 Docker イメージ
- `docker-compose.yml`: 開発用 Compose 設定

## 注意事項

- `PROJECT_STATUS.md` は作業状況管理用のローカルファイルです。`.gitignore` に追加しているため、コミット対象外です。
- 本番用の Docker 起動構成はまだ整備していません。現状は開発サーバー起動用の構成です。
