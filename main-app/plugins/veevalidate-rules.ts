import { defineNuxtPlugin } from "#app";
import { defineRule } from "vee-validate";
import * as rules from "@vee-validate/rules";

export default defineNuxtPlugin(() => {
  Object.entries(rules).forEach(([ruleName, ruleFunction]) => {
    if (typeof ruleFunction === "function") {
      defineRule(ruleName, ruleFunction as any);
    }
  });
});
