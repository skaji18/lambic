#!/bin/bash
set -x

find tests/e2e/specs -name '*.spec.js' | while read -r path
do
  # FIXME: 以下のコマンドで webpack build すると、firebase の config が標準出力に出てしまうので抑制したい
  #        単に npm run serve:emulate したときは標準出力に出ないので、実行順により何かしらの設定値がおかしくなってそう
  firebase emulators:exec --only firestore,auth --import=./emulator-data \
      "vue-cli-service --mode emulate test:e2e --headless --spec ${path}"
done

exit $?
