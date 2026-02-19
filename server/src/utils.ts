/**
 * Recursively searches an object for component references matching a given UID.
 */
export const searchInObject = (
  obj: any,
  componentName: string,
  path = ''
): string[] => {
  const results: string[] = [];

  if (!obj || typeof obj !== 'object') {
    return results;
  }

  if (obj.__component === componentName) {
    results.push(path || 'root');
  }

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const arrayPath = `${currentPath}[${index}]`;
        results.push(...searchInObject(item, componentName, arrayPath));
      });
    } else if (value && typeof value === 'object') {
      results.push(...searchInObject(value, componentName, currentPath));
    }
  }

  return results;
};

/**
 * Returns content type UIDs that should be scanned for component usage.
 */
export const getScannableContentTypes = (strapi: any): string[] => {
  return Object.keys(strapi.contentTypes).filter((uid: string) => {
    return (
      uid.startsWith('api::') ||
      (uid.startsWith('plugin::') &&
        !uid.startsWith('plugin::upload.') &&
        !uid.startsWith('plugin::users-permissions.') &&
        !uid.startsWith('plugin::component-usage.'))
    );
  });
};

const CONTENT_TYPE_UID =
  'plugin::component-usage.component-usage-tracker' as const;

export { CONTENT_TYPE_UID };
