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

CI は Infisical machine identity `GitHub Actions`（project `fickledev`、
Universal Auth、role `Viewer`）で認証する。ホームラボ全体の管理に使う
`ansible-terraform-cli` とは分離された、本リポジトリの CI 専用の identity
である。client id / client secret は本リポジトリの GitHub Actions
シークレット `INFISICAL_UNIVERSAL_AUTH_CLIENT_ID` /
`INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET` に登録する。

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

## 既知の制約

- Infisical identity `GitHub Actions` の role は project 単位の `Viewer`
  であり、`prod` 以外の environment も含め project 内の全キーを読み取れる。
  folder/path 単位でのアクセス制御は未設定のため、CI が本来必要とする
  4 キー（`PORTFOLIO_TURNSTILE_SECRET_KEY` / `PORTFOLIO_DISCORD_WEBHOOK_URL`
  / `CLOUDFLARE_WORKERS_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`）より広い
  範囲に到達可能な状態にある。
