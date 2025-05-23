import { type VersionOverride } from '@pnpm/parse-overrides'

export function createOverridesMapFromParsed (parsedOverrides: VersionOverride[] | undefined): Record<string, string> {
  if (!parsedOverrides) return {}
  const overridesMap: Record<string, string> = {}
  for (const { selector, newBareSpecifier } of parsedOverrides) {
    overridesMap[selector] = newBareSpecifier
  }
  return overridesMap
}
