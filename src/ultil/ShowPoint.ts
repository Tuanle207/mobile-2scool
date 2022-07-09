const showPoint = (point:number) => {
  if (point <= 0) {
    return ` ${point}`
  }
  return ` +${point}`
};

export {
  showPoint, 
};
