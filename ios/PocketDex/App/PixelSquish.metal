#include <metal_stdlib>
#include <SwiftUI/SwiftUI_Metal.h>
using namespace metal;

// The Pokémon on the scanner is a full-resolution picture behind the CRT's
// dot mask. This bends it under the finger: for each point on the screen it
// works out which point of the picture should show there.

namespace {
    float hash(float2 p) {
        return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
    }

    // How strongly a point feels a touch at `center`, fading over `radius`.
    float reach(float2 p, float2 center, float radius) {
        float2 d = (p - center) / radius;
        return exp(-dot(d, d) * 0.5);
    }
}

// Styles, one per type family, set how the Pokémon's body answers:
// 0 jelly (normal), 1 fire, 2 electric, 3 water, 4 ghost, 5 psychic,
// 6 ice, 7 stone (rock, ground, steel), 8 grass.
[[ stitchable ]] half4 pixelSquish(float2 position, SwiftUI::Layer layer,
                                   float2 size, float time, float style,
                                   float2 finger, float press, float2 drag,
                                   float2 pinch, float squish,
                                   float wobble, float wobbleAge,
                                   device const float *ripples, int rippleFloats) {
    float scale = max(min(size.x, size.y), 1.0);
    float stiff = style == 7 ? 0.35 : (style == 6 ? 0.6 : 1.0);
    float2 q = position;

    // A pinch draws the cheeks in toward it and lets the body bulge up and
    // down. The forward squeeze is x' = c + (x - c)(1 - 0.45k); invert it.
    if (squish != 0) {
        float k = squish * reach(q, pinch, scale * 0.3) * stiff;
        float2 d = q - pinch;
        q.x = pinch.x + d.x / max(1.0 - 0.45 * k, 0.2);
        q.y = pinch.y + d.y / (1.0 + 0.2 * k);
    }

    // The finger dents the picture, pushing it out of the way, and drags the
    // part it holds along with it.
    float touch = press * reach(q, finger, scale * 0.14);
    if (press > 0) {
        float2 d = q - finger;
        float r = max(length(d), 0.001);
        q -= d / r * touch * scale * 0.06 * stiff;
        q -= drag * reach(q, finger, scale * 0.22) * press * 0.85 * stiff;
    }

    // Each tap sends a ring outward that dies away.
    // Three floats per ripple: x, y, and age in seconds.
    for (int i = 0; i < rippleFloats / 3; i++) {
        float2 center = float2(ripples[i * 3], ripples[i * 3 + 1]);
        float age = ripples[i * 3 + 2];
        float2 d = q - center;
        float r = max(length(d), 0.001);
        float front = age * scale * 1.1;
        float band = (r - front) / (scale * 0.05);
        float amplitude = (style == 3 ? 7.0 : 3.5) * exp(-age * 3.0) * stiff;
        q -= d / r * sin(band * 3.0) * exp(-band * band) * amplitude;
    }

    // Let go, and the whole body shivers like jelly before it settles.
    if (wobble > 0) {
        float settle = wobble * exp(-wobbleAge * 4.5) * stiff;
        q.x += sin(q.y / scale * 9.0 + wobbleAge * 26.0) * settle * scale * 0.025;
        q.y += cos(q.x / scale * 7.0 + wobbleAge * 21.0) * settle * scale * 0.012;
    }

    // Type textures around the finger while it is down.
    float near = press * reach(q, finger, scale * 0.2);
    if (style == 1) {
        // Heat shimmer.
        q.x += sin(q.y * 0.18 + time * 14.0) * 2.2 * near;
        q.y -= (0.5 + 0.5 * sin(q.x * 0.1 + time * 9.0)) * 2.0 * near;
    } else if (style == 2) {
        // Static: cells of the picture jump about.
        float2 cell = floor(q / 3.0);
        float jitter = hash(cell + floor(time * 24.0)) - 0.5;
        q += float2(jitter, hash(cell.yx + floor(time * 24.0)) - 0.5) * 7.0 * near;
    } else if (style == 5) {
        // It floats, rippling slowly.
        q.y += sin(q.x / scale * 12.0 + time * 4.0) * 4.0 * near;
    } else if (style == 8) {
        // Leaves rustle.
        q.x += sin(q.y * 0.09 + time * 7.0) * 1.6 * near;
    }

    half4 color = layer.sample(q);

    if (style == 1) {
        color.rgb += half3(0.45, 0.12, 0.0) * color.a * half(near);
    } else if (style == 2) {
        float spark = step(0.9, hash(floor(q / 3.0) + floor(time * 30.0)));
        color.rgb += half3(0.55, 0.5, 0.1) * color.a * half(spark * near);
    } else if (style == 4) {
        // The finger passes straight through a ghost.
        color *= half(1.0 - 0.75 * near);
    } else if (style == 6) {
        color.rgb = mix(color.rgb, half3(0.8, 0.95, 1.0) * color.a, half(0.45 * near));
    }
    return color;
}

// Dissolves between two pictures a dot at a time: each 3pt cell of the new
// picture appears at its own moment as `progress` runs from 0 to 1.
[[ stitchable ]] half4 dotDissolve(float2 position, half4 color, float progress, float incoming) {
    float2 cell = floor(position / 3.0);
    float threshold = hash(cell);
    bool shown = incoming > 0.5 ? threshold < progress : threshold >= progress;
    return shown ? color : half4(0);
}
