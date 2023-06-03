const urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
const hostedImagesRegex = /^static\/images\/[(\w+)+-]+\/[(\w+)+-]+\/[(\w+)+-]+.\w{3,4}/gi;

export { urlRegex, hostedImagesRegex };
