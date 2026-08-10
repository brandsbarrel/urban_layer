const buildPaginationMeta = ({ page, perPage, totalItems }) => {
  return {
    page,
    perPage,
    totalItems,
    totalPages: Math.max(Math.ceil(totalItems / perPage), 1)
  };
};

export { buildPaginationMeta };
