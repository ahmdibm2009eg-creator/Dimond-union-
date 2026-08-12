import { translations } from './translations';

// Flatten a nested object into dot-notation keys, only for string leaves
export function flattenTranslations(obj, prefix = '') {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result.push({ key: fullKey, value });
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object' && item !== null) {
          result.push(...flattenTranslations(item, `${fullKey}.${i}`));
        } else if (typeof item === 'string') {
          result.push({ key: `${fullKey}.${i}`, value: item });
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      result.push(...flattenTranslations(value, fullKey));
    }
  }
  return result;
}

// Apply a flat key override into a nested translations object (immutably)
function setNested(obj, path, value) {
  const parts = path.split('.');
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let current = clone;
  for (let i = 0; i < parts.length - 1; i++) {
    const idx = parseInt(parts[i], 10);
    const key = isNaN(idx) ? parts[i] : idx;
    current[key] = Array.isArray(current[key]) ? [...current[key]] : { ...current[key] };
    current = current[key];
  }
  const lastIdx = parseInt(parts[parts.length - 1], 10);
  const lastKey = isNaN(lastIdx) ? parts[parts.length - 1] : lastIdx;
  current[lastKey] = value;
  return clone;
}

export function applyOverrides(baseTranslations, overrides) {
  let result = baseTranslations;
  for (const o of overrides) {
    if (o.content_key && o.value_ar !== undefined) {
      result = setNested(result, o.content_key, o.value_ar);
    }
  }
  return result;
}

export function applyOverridesEn(baseTranslations, overrides) {
  let result = baseTranslations;
  for (const o of overrides) {
    if (o.content_key && o.value_en !== undefined) {
      result = setNested(result, o.content_key, o.value_en);
    }
  }
  return result;
}

// Get all editable text entries for a given language
export function getEditableTexts(lang) {
  return flattenTranslations(translations[lang]);
}

// Get value at a dot-notation path from a nested object
export function getValueAtPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    const idx = parseInt(part, 10);
    const key = isNaN(idx) ? part : idx;
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}