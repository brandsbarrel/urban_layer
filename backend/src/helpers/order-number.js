const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `UL-${Date.now().toString().slice(-6)}${random}`;
};

export { generateOrderNumber };
