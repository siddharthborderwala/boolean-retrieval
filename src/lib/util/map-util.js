const replacer = (_, value) => {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: [...value], // or with spread: value: [...value]
    };
  } else {
    return value;
  }
};

const reviver = (_, value) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
};

export const stringifyMap = (map, space = 2) =>
  JSON.stringify(map, replacer, space);

export const parseMap = (map, space = 2) => JSON.parse(map, reviver, space);
