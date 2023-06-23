const urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/gi;
const hostedFilesRegex =
  /^static\/(images|audio|video)\/[(\w+)+-]+\/[(\w+)+-]+\/[(\w+)+-]+.\w{3,4}/gi;

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
function isAudioLink(link: string) {
  const audioExtensions = ['mp3', 'wav', 'midi', 'mid', 'm4a', 'm4b', 'm4p', 'ogg'];
  const extension = link.split('.').pop();
  if (!extension) return;
  return audioExtensions.includes(extension.toLowerCase());
}

function getLinkType(link: string): 'image' | 'video' | 'audio' | 'YouTube' | null {
  if (isYouTubeLink(link)) return 'YouTube';
  if (isImageLink(link)) return 'image';
  if (isVideoLink(link)) return 'video';
  if (isAudioLink(link)) return 'audio';
  return null;
}

export { urlRegex, hostedFilesRegex, getLinkType };
