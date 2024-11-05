export const matchesIgnoreCondition = (
  element: HTMLElement,
  conditions: Array<string | ((element: HTMLElement) => boolean)>,
): boolean => {
  if (!conditions) return false;
  return conditions.some((condition) => {
    if (typeof condition === 'function') {
      return condition(element);
    } else if (condition.startsWith('.')) {
      return element.classList.contains(condition.substring(1));
    } else if (condition.startsWith('#')) {
      return element.id === condition.substring(1);
    } else if (condition.includes('[') && condition.includes(']')) {
      const tagName = condition.split('[')[0];
      const attributeCondition = condition.slice(condition.indexOf('[') + 1, condition.indexOf(']')).split('=');
      const attrName = attributeCondition[0];
      const attrValue = attributeCondition[1]?.replace(/['"]/g, ''); // Remove quotes if present
      return element.tagName.toLowerCase() === tagName.toLowerCase() && element.getAttribute(attrName) === attrValue;
    } else if (condition.startsWith('text=')) {
      const textValue = condition.slice(5).replace(/['"]/g, '');
      return element.textContent?.trim() === textValue;
    } else {
      return element.tagName.toLowerCase() === condition.toLowerCase();
    }
  });
};