# PocketDex

An offline, native SwiftUI fan demo for iPhone Duo. The outer display is the
Pokédex cover; opening the device reveals a twelve-Pokémon guessing game.

## Run after the Duo toolchain update

Apple lists macOS Tahoe **26.6 or later** for Xcode 27.1 beta. Install the beta
alongside the existing Xcode and install its **iOS 27.1 simulator runtime**.
Create an iPhone Duo simulator in Xcode's Device Hub.

Open `PocketDex.xcodeproj` in that Xcode, select the **PocketDex** scheme, and
choose the Duo simulator. No signing team is needed for the simulator. For a
physical device, select your own team in Signing & Capabilities.

```sh
DEVELOPER_DIR=/Applications/Xcode-beta.app/Contents/Developer \
  xcodebuild -project ios/PocketDex/PocketDex.xcodeproj \
  -scheme PocketDex -destination 'platform=iOS Simulator,name=iPhone Duo' \
  -derivedDataPath .context/PocketDexDuo build
```

Run this command from the repository root, adjusting the app path and simulator
name to the installation. The primary scheme uses the iOS 27.1 SDK and
`POCKETDEX_DUO` compilation condition; it never silently substitutes a simulated
hinge. `FoldObserver` consumes `onHingeChange` / `DeviceHinge`; `FoldPanels` uses
`ArrangementView(.split)` to respect reserved fold regions. The shared
`GameStore` keeps the same game alive across display changes. Hinge angle is
presentation input, not a layout breakpoint.

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

Use the Duo simulator's own folding controls for the showcase recording.
Compatibility footage demonstrates app content and manual open/close only.

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

Verified on the current toolchain: all 10 core tests, three iPhone UI tests,
the iPad showcase test, and a repeat of capture/restart after the review fix.
Debug and Release compatibility builds, repository lint, and repository build
pass. Simulator recording and screenshots are saved under `.context/`:
`pocketdex-compatibility.mp4`, `pocketdex-open.png`, `pocketdex-closed.png`,
`pocketdex-captured.png`, and `pocketdex-collection.png`. The recording is a
silent iPad compatibility preview; native Duo footage still needs that runtime.

After installing the new toolchain, manually verify on Duo:

1. Launch closed, then unfold: cover switches to the two interior panels.
   Also launch already unfolded to verify initial hinge delivery.
2. Fold partially and rotate: all controls avoid reserved regions and stay usable.
3. Close during reveal and during the Poké Ball phase; reopen and confirm the
   capture count increments only once.
4. Change displays while viewing the collection and while a choice is selected.
5. Background and resume, then restart: answers, selection, and captures persist.
6. Check VoiceOver and Reduce Motion. Hidden silhouettes must not disclose names.

The automated UI suite uses compatibility Open/Close controls. On actual Duo,
use the simulator's physical folding controls for these checks; the suite's
manual-opening assumptions do not validate a physical fold.

Duo SDK compilation and actual hinge validation remain pending the user's
macOS/Xcode update. The current machine has macOS 26.5.2, Xcode 26.6, and iOS
26.5 simulators. Do not call a compatibility run a Duo verification.

Resources are bundled in `Resources/`; see `Resources/SOURCES.md` for attribution
and regeneration. No network requests, backend, accounts, or analytics are used.

References: [Apple requirements](https://developer.apple.com/xcode/system-requirements),
[hinge updates](https://developer.apple.com/documentation/swiftui/view/onhingechange(isenabled:_:)),
[arrangements](https://developer.apple.com/documentation/swiftui/arrangementview).
