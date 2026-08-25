# React × Rails はじめての実務ハンズオン

ReactもRailsも初めての人が、実際にコードを動かしながら学ぶためのリポジトリです。

## 始める

初回だけ、リポジトリを取得します。

```bash
git clone --branch feat/beginner-hands-on-course https://github.com/sota411/react-rails.git
cd react-rails
```

以後、開始するときに実行するのはこれだけです。

```bash
./learn
```

`./learn` は、次の処理をまとめて行います。

1. ReactとRailsを起動する
2. 学習用画面をブラウザで開く
3. Codexを起動し、Lesson 0〜8の選択肢を表示する

Lessonの順番は固定しません。Codexに番号を返すと、選んだLessonだけを始めます。
終了するときはCodexを閉じるか `Ctrl+C` を押します。ReactとRailsも同時に停止します。

必要なものはDockerとCodex CLIです。見つからない場合、`./learn` が不足しているものだけを表示します。
