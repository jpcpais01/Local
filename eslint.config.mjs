import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // These React-Compiler-era hook rules are new in eslint-plugin-react-hooks
      // v6 and are overly strict for two deliberate, standard patterns used
      // throughout this app:
      //  - set-state-in-effect: reading localStorage on mount and syncing it
      //    into state is the documented way to avoid SSR/client hydration
      //    mismatches (localStorage isn't available on the server).
      //  - use-memo: our generic `useAsyncData(fn, deps)` hook forwards a
      //    caller-supplied dependency array, which can't be a static array
      //    literal by construction.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/use-memo": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
