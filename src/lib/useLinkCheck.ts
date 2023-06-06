const urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
const hostedImagesRegex = /^static\/images\/[(\w+)+-]+\/[(\w+)+-]+\/[(\w+)+-]+.\w{3,4}/gi;

function isYouTubeLink(link: string) {
  return link.match(/^https:\/\/(www.)?youtube.\S+/gi);
}
function isImageLink(link: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = link.split('.').pop();
  if (!extension) return;
  return imageExtensions.includes(extension.toLowerCase());
}
function isVideoLink(link: string) {
  const videoExtensions = ['mp4', 'webm', 'ogg'];
  const extension = link.split('.').pop();
  if (!extension) return;
  return videoExtensions.includes(extension.toLowerCase());
}

function getLinkType(link: string): 'image' | 'video' | 'YouTube' | null {
  console.log(link);
  if (isYouTubeLink(link)) return 'YouTube';
  if (isImageLink(link)) return 'image';
  if (isVideoLink(link)) return 'video';
  return null;
}

export { urlRegex, hostedImagesRegex, getLinkType };
