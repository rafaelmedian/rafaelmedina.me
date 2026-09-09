export default {
  extends: ["stylelint-config-recommended"],
  rules: {
    // Component/state selectors intentionally have independent ordering.
    // This rule cannot know whether their elements share a DOM context.
    "no-descending-specificity": null,
    "at-rule-no-unknown": [true, { ignoreAtRules: ["theme", "utility", "custom-variant", "variant", "source", "plugin", "reference", "apply", "layer", "config"] }],
    "declaration-property-value-disallowed-list": { transition: ["/\\ball\\b/"] },
  },
}
