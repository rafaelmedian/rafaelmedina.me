# PocketDex

An offline, native SwiftUI fan demo for iPhone Duo. The outer display is the
Pokédex cover; opening the device reveals a twelve-Pokémon guessing game.

## Run on the Duo simulator

Needs macOS 26.6 or later, Xcode 27.1 beta installed alongside the current
Xcode, and its iOS 27.1 runtime. Create an iPhone Duo simulator in Device Hub
(`Xcode-27.1.0-Beta.app/Contents/Applications/DeviceHub.app`); the scripts
assume it is named `pocketdex-duo`. No signing team is needed for the
simulator. For a physical device, select your own team in Signing &
Capabilities.

The scanner bends the Pokémon with a Metal shader (`App/PixelSquish.metal`).
Each Xcode needs its Metal Toolchain once; a missing one fails the build with
"cannot execute tool 'metal'". Install it with
`xcodebuild -downloadComponent MetalToolchain` under each `DEVELOPER_DIR`.

```sh
DEVELOPER_DIR=/Applications/Xcode-27.1.0-Beta.app/Contents/Developer \
  xcodebuild -project ios/PocketDex/PocketDex.xcodeproj \
  -scheme PocketDex -destination 'platform=iOS Simulator,name=pocketdex-duo' \
  -derivedDataPath .context/PocketDexDuo build
```

The primary scheme uses the iOS 27.1 SDK and the `POCKETDEX_DUO` compilation
condition, and never substitutes a simulated hinge.

## How the fold is drawn

The Duo's cover swings open to the left and its right half stays put, so the
Pokédex is the classic one mirrored. The cover and the open display both come
from the same shared geometry (`App/Hardware.swift`):

- The lens and lights sit on the body's top strip. On the cover the lens
  wraps the outer camera. The camera comes from the `.occlusion` reserved
  region; the status strip beside it is also an occlusion, so the smallest
  round one wins.
- The cover saves where it drew the lens. The open body draws the lens at the
  same distance from the top and right edges, the ones that do not move, so
  the strip holds still while the flap swings. The inner camera gets its own
  dark sensor window.
- The `.division` region splits the open display. The flap's inside, on the
  left, mirrors the cover's seam across it, and a hinge barrel sits on top.

`FoldObserver` feeds `onHingeChange` into `GameStore`. Opening runs a stepped
power-on: lights go red, yellow, green; the CRTs go from dot to line to
picture; keys rise in order. The hinge angle caps the power-on, so a slow
unfold wakes the Pokédex gradually. Hinge angle is presentation input, not a
layout breakpoint.

## Compatibility preview on the current Mac

The **PocketDexCompatibility** scheme targets iOS 26.0 and excludes the new Duo
APIs. It runs the same native game and panels on an ordinary iPhone or iPad.
Use **Open case** and **Close case**. This verifies the app, but does **not**
validate native hinge events, fold-safe layout, or outer/inner display handoff.

```sh
xcodebuild -project ios/PocketDex/PocketDex.xcodeproj \
  -scheme PocketDexCompatibility \
  -destination 'platform=iOS Simulator,name=PocketDex-preview' \
  -derivedDataPath .context/PocketDexBuild build
```

`project.yml` is the project source of truth. The generated Xcode project is
committed so opening it needs no extra tools. After editing the manifest, run
`xcodegen generate --spec ios/PocketDex/project.yml` (XcodeGen 2.46 or later).

## Play

- Read the clue and identify the silhouette. Select one of four blue keys,
  or move with the D-pad, then press the yellow Confirm button.
- Wrong choices are disabled for this round. There is no time limit or penalty.
- A correct guess reveals the artwork, plays a capture sequence, and registers
  one discovery. Press Next to continue.
- Closing or backgrounding during a capture pauses its presentation. Reopening
  resumes; restarting the app displays the already-saved captured result.
- Your discoveries shows caught artwork and anonymous undiscovered silhouettes.
  Find all twelve for the ending. Starting again requires an explicit choice.
- Audio respects the silent switch and has a mute control. Hardware haptics
  require a physical device. Reduce Motion skips the capture choreography.

## Reproducible recording

In a **Debug** build, add launch arguments `--demo --reset --developer` to
start a repeatable deck with Gengar first. Choose Gengar, confirm, visit the
collection, then close the case. The wrench menu resets the demo in place.
`--reset` intentionally clears progress on every launch; remove it to resume.
`--ui-testing` isolates test progress from personal progress.
These launch arguments and the wrench menu are excluded from release builds.

### Showcase video

`scripts/record-duo-demo.sh` records the whole story in Device Hub's 3D view:
closed cover, unfold, a wrong guess, the capture, close, reopen, next round.
Before running it:

- Open the `pocketdex-duo` device in its own Device Hub window, at 100%.
- Give the terminal app Accessibility and Screen Recording permission.

Device Hub has no scripting interface for the hinge, so `scripts/devicehub.swift`
clicks its posture buttons and the device's screen. Leave the Mac alone for
the ~35 seconds it runs. The raw window capture lands in
`.context/pocketdex-duo-demo/`. `simctl io screenshot` returns black for the
inner display; capture the Device Hub window instead.

## Validation

```sh
swift test --package-path ios/PocketDex/Core
xcodebuild -project ios/PocketDex/PocketDex.xcodeproj \
  -scheme PocketDexCompatibility \
  -destination 'platform=iOS Simulator,name=PocketDex-preview' \
  -derivedDataPath .context/PocketDexBuild test
```

Core tests exercise random choices, retries, unique captures, save validation,
completion, seeded replay, and fold-state transitions. UI tests exercise
opening, selection, collection, retry/capture, restart, rotation, and large type.

Verified: all 10 core tests, and the four compatibility UI tests on the
`PocketDex-preview` simulator. The Duo build runs on the iPhone Duo simulator
(iOS 27.1). It was checked by folding it in Device Hub through closed,
half-open, and open, capturing Gengar, closing mid-game, and reopening.
Reopening kept the capture and did not award it twice.

The automated UI suite still uses the compatibility Open/Close controls; it
does not fold a Duo.

Resources are bundled in `Resources/`; see `Resources/SOURCES.md` for attribution
and regeneration. No network requests, backend, accounts, or analytics are used.

References: [Apple requirements](https://developer.apple.com/xcode/system-requirements),
[hinge updates](https://developer.apple.com/documentation/swiftui/view/onhingechange(isenabled:_:)).
