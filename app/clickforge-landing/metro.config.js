const { getDefaultConfig } = require('expo/metro-config');

/**
 * The default Expo Metro config, with package exports turned on.
 *
 * `@supabase/supabase-js` ships as ESM and points at its own sub-packages
 * (`@supabase/auth-js`, `postgrest-js`, …) through the `exports` field in their
 * package.json rather than through main/module paths. Metro resolves the older
 * fields by default here, so the bundle fails with "Unable to resolve
 * @supabase/auth-js" even though the package is installed — this is the flag
 * that makes it read `exports`.
 */
const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
