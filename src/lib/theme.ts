import { type Writable, writable } from 'svelte/store';

export const theme = writable(null) as Writable<null | 'light' | 'dark'>;
