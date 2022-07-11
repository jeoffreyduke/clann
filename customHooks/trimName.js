export const trimName = (name, length) => {
  if (name?.length > length) {
    return name?.substring(0, length) + "...";
  } else return name;
};
