# React × Rails はじめての実務ハンズオン

ReactとRailsを初めて触る人向けの、ブラウザ完結型ハンズオンです。

## 始める

初回だけ取得します。

```bash
git clone https://github.com/sota411/react-rails.git
cd react-rails
```

学習を始めるときは、リポジトリ直下でこれだけ実行します。

```bash
./learn
```

`./learn` がReactとRailsを起動し、学習画面をブラウザで開きます。**Codex CLIは起動しません。**

画面が開いたら、学びたいハンズオンを1本選びます。順番は固定していません。各Stepには常に次が表示されます。

- 今やること
- 変更または実行する対象
- 完了条件
- その場で結果を確認するbutton

コード問題はブラウザ内のsandboxで編集し、決定的なruleで即時判定します。HTTPのStepでは、localhost上のRails APIへ実際にrequestを送ってmethod・path・status・response bodyを確認します。

終了するときは、`./learn` を実行したTerminalで `Ctrl+C` を押します。

必要なものはDockerだけです。
