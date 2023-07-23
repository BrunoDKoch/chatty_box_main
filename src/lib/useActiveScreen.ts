import { type Writable, writable } from 'svelte/store';

export default writable(null) as Writable<'friends' | 'chat' | 'aside' | null>;
