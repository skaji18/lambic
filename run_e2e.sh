#!/bin/bash
set -x

exit_code=0

file_paths=$(find tests/e2e/specs -name '*.spec.js')
while read -r path
do
  # FIXME: 以下のコマンドで webpack build すると、firebase の config が標準出力に出てしまうので抑制したい
  #        単に npm run serve:emulate したときは標準出力に出ないので、実行順により何かしらの設定値がおかしくなってそう
  SCREEN_SHOT_PATH=$(basename ${path}) firebase emulators:exec --only firestore,auth --import=./emulator-data \
      "vue-cli-service --mode emulate test:e2e --headless --spec ${path}"
  if [ $? -ne 0 ]; then
    exit_code=1
  fi
done << END
  ${file_paths}
END

exit ${exit_code}
