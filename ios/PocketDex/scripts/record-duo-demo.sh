#!/bin/zsh
# Records the PocketDex showcase in Device Hub's 3D view: closed cover,
# unfold, a wrong guess, the capture, close, reopen, and the next round.
#
#   ios/PocketDex/scripts/record-duo-demo.sh [output.mov]
#
# Needs Xcode 27.1 beta with an iPhone Duo simulator named "pocketdex-duo"
# (override with POCKETDEX_DEVICE), that device opened in its own Device Hub
# window, and Accessibility plus Screen Recording permission for the terminal.
# The script clicks inside the Device Hub window, so leave the Mac alone
# while it runs (about 35 seconds).
set -euo pipefail

root=${0:A:h:h:h:h}
out=${1:-$root/.context/pocketdex-duo-demo/pocketdex-duo-raw.mov}
device=${POCKETDEX_DEVICE:-pocketdex-duo}
export DEVELOPER_DIR=${DEVELOPER_DIR:-/Applications/Xcode-27.1.0-Beta.app/Contents/Developer}
build=$root/.context/PocketDexDuo
hub=$build/devicehub

mkdir -p ${out:h} $build
swiftc -O $root/ios/PocketDex/scripts/devicehub.swift -o $hub
xcodebuild -project $root/ios/PocketDex/PocketDex.xcodeproj -scheme PocketDex \
  -destination "platform=iOS Simulator,name=$device" -derivedDataPath $build build -quiet
xcrun simctl install $device $build/Build/Products/Debug-iphonesimulator/PocketDex.app

open -a "${DEVELOPER_DIR:h}/Applications/DeviceHub.app"
sleep 1
$hub posture closed
sleep 2.5
xcrun simctl terminate $device me.rafaelmedina.PocketDex 2>/dev/null || true
# --demo fixes the deck (Gengar first; keys: Snorlax, Meowth, Psyduck, Gengar).
xcrun simctl launch $device me.rafaelmedina.PocketDex --demo --reset >/dev/null
sleep 3

read -r window x y width height <<< "$($hub window)"
# Park the pointer at the top of the window so the device sits level.
$hub click $((width / 2)) 12
sleep 0.5

# Points on the open device, relative to the window (Device Hub at 100%).
meowth=(358 555); gengar=(358 611); ok=(168 683)

rm -f $out
screencapture -x -v -V 34 -l$window $out &
recorder=$!
sleep 3.0;  $hub posture open            # unfold: the Pokédex wakes
sleep 4.2;  $hub click $meowth           # a wrong guess
sleep 0.9;  $hub click $ok
sleep 2.4;  $hub click $gengar           # the right one
sleep 0.9;  $hub click $ok               # reveal, Poké Ball, registered
sleep 4.2;  $hub posture closed          # fold it shut: the count is 01
sleep 4.0;  $hub posture open            # reopen: the capture is still there
sleep 3.6;  $hub click $ok               # next Pokémon
sleep 4.0;  $hub posture closed
wait $recorder
echo "Saved $out"
