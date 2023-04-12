import { type Writable, writable } from 'svelte/store';

export let theme = writable(null) as Writable<null | 'light' | 'dark'>;
