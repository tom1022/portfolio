# 配信構成とデプロイ

## 配信構成

`fickledev.com` は静的エクスポートした Next.js アプリと、それを配信する
Cloudflare Worker の組み合わせで配信する。

- `next build`（`next.config.js` の `output: 'export'`）が `out/` に純粋な
  静的ファイル一式を生成する。画像は `images.unoptimized: true` により
  ビルド時にそのまま出力され、実行時の最適化処理に依存しない。
- `worker/index.js` が Worker のエントリポイントで、`POST /api/contact`
  （人間性検証と Discord Webhook への通知）のみを自前で処理し、それ以外の
  すべての要求は `env.ASSETS.fetch(request)` で `out/` の静的アセットを
  返す。
- `wrangler.jsonc` が実行基盤の設定ファイルであり、`assets.directory`
  （`out`）と `main`（`worker/index.js`）の宣言によって、静的成果物の配信
  と動的経路 (`/api/contact`) への振り分けが一意に決まる。アプリケーション
  コード側に振り分けロジックは存在しない。

## シークレットの供給元

Infisical（プロジェクト `59f7eabf-94e5-49d0-85ed-975dfdf27f11`、環境
`prod`）を単一の情報源とする。Worker が参照するキー:

| Infisical キー | Worker 側の名前 | 用途 |
|---|---|---|
| `PORTFOLIO_TURNSTILE_SECRET_KEY` | `TURNSTILE_SECRET_KEY`（Worker Secret） | Turnstile 検証 |
| `PORTFOLIO_DISCORD_WEBHOOK_URL` | `DISCORD_WEBHOOK_URL`（Worker Secret） | 通知送信 |
| `CLOUDFLARE_WORKERS_API_TOKEN` | `CLOUDFLARE_API_TOKEN`（wrangler 認証） | Workers Scripts の Edit 権限を持つトークン |
| `CLOUDFLARE_ACCOUNT_ID` | `CLOUDFLARE_ACCOUNT_ID`（wrangler 認証） | デプロイ先アカウント |

いずれの値も `wrangler.jsonc` やリポジトリ内のファイルに平文で置かない。
CI は `infisical run` で子プロセスの環境変数としてのみこれらを受け取り、
`TURNSTILE_SECRET_KEY` / `DISCORD_WEBHOOK_URL` は `wrangler secret put` で
Worker 側のシークレットとして都度反映する。

`NEXT_PUBLIC_TURNSTILE_SITE_KEY`（Turnstile のサイトキー、公開値）は
シークレットではないため対象外とし、引き続き GitHub Actions の repository
secret から `next build` 時の環境変数として供給する。

## デプロイ手順

`main` への push、または `workflow_dispatch` の手動実行で
`.github/workflows/deploy.yml` が走り、`npm run build` の後
`wrangler secret put` で Worker Secret を反映してから `wrangler deploy`
する。コンテナイメージの転送・SSH・VPN のいずれにも依存しない。

## ローカルでの確認

- UI の確認: `npm run dev`
- Worker を含めた確認: `npm run build && npm run worker:dev`
  （`wrangler dev` を起動する。リポジトリ直下に `.dev.vars` を作り
  `TURNSTILE_SECRET_KEY` / `DISCORD_WEBHOOK_URL` をローカル用の値で設定
  する。`.dev.vars` は `.gitignore` の対象でありコミットしない）

## 未整備

- `CLOUDFLARE_WORKERS_API_TOKEN` / `PORTFOLIO_DISCORD_WEBHOOK_URL` /
  `PORTFOLIO_TURNSTILE_SECRET_KEY` は Infisical 上にプレースホルダのみ
  存在する。運用者が実値（`Account / Workers Scripts / Edit` 権限を持つ
  Cloudflare API トークン、Discord Webhook URL、Turnstile の実際の
  secret key）へ差し替えるまで、CI からの実デプロイは行えない。
  `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_ZONE_ID` は実値が登録済み。
- CI から Infisical への認証に使う `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID` /
  `INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET` は、本リポジトリの GitHub
  Actions シークレットとしてまだ登録されていない。既存の Infisical
  machine identity は `prod` 環境の全キー（ホームラボ全体のシークレット
  を含む）に到達できるロールしか持たないため、そのまま公開リポジトリの
  CI に登録することは避ける。運用者が本リポジトリ用のキー 3 件
  （`PORTFOLIO_TURNSTILE_SECRET_KEY` / `PORTFOLIO_DISCORD_WEBHOOK_URL` /
  `CLOUDFLARE_WORKERS_API_TOKEN`）と、配信先切り替え後に必要になる
  `CLOUDFLARE_ACCOUNT_ID` に絞った新しい machine identity を Infisical
  上で発行し、その client id / secret を登録する必要がある。
