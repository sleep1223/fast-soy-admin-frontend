import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';

type LangMessages = Record<string, unknown>;

function deepMerge<T extends LangMessages>(target: T, source: LangMessages): T {
  for (const key of Object.keys(source)) {
    const sv = source[key];
    const tv = (target as LangMessages)[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      (target as LangMessages)[key] = deepMerge({ ...(tv as LangMessages) }, sv as LangMessages);
    } else {
      (target as LangMessages)[key] = sv;
    }
  }
  return target;
}

const zhMods = import.meta.glob<LangMessages>('./langs/_generated/*/zh-cn.ts', { eager: true, import: 'default' });
const enMods = import.meta.glob<LangMessages>('./langs/_generated/*/en-us.ts', { eager: true, import: 'default' });

function buildMessages(base: App.I18n.BaseSchema, mods: Record<string, LangMessages>): App.I18n.Schema {
  const merged = structuredClone(base) as unknown as LangMessages;
  for (const mod of Object.values(mods)) {
    deepMerge(merged, mod);
  }
  return merged as unknown as App.I18n.Schema;
}

const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  'zh-CN': buildMessages(zhCN, zhMods),
  'en-US': buildMessages(enUS, enMods)
};

export default locales;
