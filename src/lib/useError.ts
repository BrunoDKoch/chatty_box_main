import { writable, type Writable } from 'svelte/store';

export default writable(null) as Writable<null | App.Error>;

export function getIcon(status: number) {
  switch (status) {
    case 400:
      return 'material-symbols:warning';
    case 401:
      return 'mdi:shield-alert';
    case 402:
      return 'ph:money';
    case 403:
      return 'icon-park-solid:error';
    case 404:
      return 'mdi:cloud-question';
    case 405:
      return 'ic:baseline-not-interested';
    case 409:
      return 'mdi:database-alert';
    case 418:
      return 'icon-park-solid:teapot';
    case 429:
      return 'ic:baseline-front-hand';
    case 451:
      return 'tabler:prison';
    case 500:
      return 'mdi:server-off';
    case 502:
    case 503:
      return 'mdi:server-network-off';
    case 504:
      return 'mdi:clock-alert';
    default:
      return 'mdi:close-circle';
  }
}