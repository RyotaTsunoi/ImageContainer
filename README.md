<!-- @format -->

# ImageContainer

Storage application using AzureFunction to store large amounts of binary data.

## enviroment

### development env

- VSCode:1.52.1
- NodeJs:14.9.0
- typescript:3.3.3
- PostgreSql:13

### using npm package

- typeORM(Typescript ORM)[Document](https://typeorm.io/#/)
- pg(postgreSQL driver)
- refrect-metadata(dependency typeORM)
- base64-js(Base64 decode)
- qs(http request body parser)

### vscode extensions

- AzureAccount:0.9.4
- Azure Functions:1.2.0

### other tools

- Postman
- Azure storage explorer

### azure resources

- Application Insights(ログ取得用)
- ストレージアカウント(BlobStorage)
- AppServicePlan(Azurefunction デプロイするのに必要)
- Azure function(API)
- APIManagement(API 管理)-まだ
- Azure Database for PostgreSQL

## Architecture diagram

![Architecture diagram](/メモ/ImageContainerArchtecture.png)

## PoC

1. Azurefunction の HttpBinding を使った、バイナリデータの BlobStorage 保管

- 想定したオペレーション
  1. クライアントから指定 URL に対して Http リクエストが飛ばされる。Body に Json データが格納(画像は Base64 でエンコードされたものを渡す)
  2. AzureFunction 上でリクエストを解析。Base64 文字列をデコードし、AzureBlobStorage に格納。
  3. その他ボディのデータを PostgresSqlServer にメタデータと、2 で格納した BlobContent とのリンクを格納する―まだ

## APIs

1. /getimage/{key} **未完成**

- key 項目でクエリを行い、その結果を base64 形式で返す

2. /storeimage **一応動くはず**

- リクエスト Body に埋め込まれた Base64 文字列で、blob storage にバイナリデータを保存する

## problems

- VSCode から Azure に関数デプロイするときにエラー

  1. Error:Project Language null
     - AzureFunctionExtension の ProjectLanguage 設定が影響？そこがデプロイしようとしている言語と合ってないとエラー？
     - 解消方法:VSCode―設定 →Project Language で検索 → 自分の開発環境のプログラミング言語と合わせる
  2. Error:Project Runtime null
     1. AzureFunctionExtension の ProjectRuntime 設定が影響？Version1 だとうまく動かなかった
     2. 解消方法:VSCode―設定 →Project Runtime で検索 →3 に変更
  3. バイナリデータがうまく受信できなかった(Base64 文字列で渡す方法を試す前はバイナリを直接渡していた)
     1. Content-type の問題、イメージファイルだから image/png とかしていたがこれが NG
     2. 解消方法:Content-Type は application/octet-stream でリクエストを投げる
     3. [参考リンク](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=javascript)
  4. TypeORM のベストプラクティスがわからない
     1. ドキュメント読んだり色々考えたりする
  5. Deploy 後に AzureSQL につながらない
     1. 環境変数の設定がローカルにしかなかった
     2. 解消方法:AzureFunction→ 設定 → 構成 → アプリケーション設定で、新しいアプリケーション設定に追加していく
     3. [参考リンク](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal)

## enhance items

- StorageKey 等を、アプリケーション設定に追加するのではなく、Azure key vault を使ってみる
- 単一テーブルへの接続しか対応できていないので、汎用的なクラスを作る
- 認証システム(AzureAD とか)
- この API を使用するフロントエンド構築(NextJs on AzureStaticWebApps)
- AzureDevOps での CI/CD
- BlobStorage 格納をキーに OCR を動かすファンクション作る

## appendix

### running cost

![running cost](/メモ//AzureRunningCost.png)

### database data image

![database data image](/メモ/DatabaseDataSample.png)
