<!-- @format -->

# Azure function

## 環境

### 開発環境

- VSCode:1.52.1
- NodeJs:14.9.0
- typescript:3.3.3

### VSCode 拡張機能

- AzureAccount:0.9.4
- Azure Functions:1.2.0

### 使用ツール

- Postman
- Azure storage explorer

### Azure resources

- Application Insights(ログ取得用)
- ストレージアカウント(BlobStorage)
- AppServicePlan(Azurefunction デプロイするのに必要)
- Azure function(API)
- APIManagement(API 管理)-まだ
- PostgresSQL

## 何を試したか

1. Azurefunction の HttpBinding を使った、バイナリデータの BlobStorage 保管

- 想定したオペレーション
  1. クライアントから指定 URL に対して Http リクエストが飛ばされる。Body に Json データが格納(画像は Base64 でエンコードされたものを渡す)
  2. AzureFunction 上でリクエストを解析。Base64 文字列をデコードし、AzureBlobStorage に格納。
  3. その他ボディのデータを PostgresSqlServer にメタデータと、2 で格納した BlobContent とのリンクを格納する―まだ

## 躓いたこと

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
