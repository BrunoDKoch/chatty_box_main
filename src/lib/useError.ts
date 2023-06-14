import { writable, type Writable } from 'svelte/store';

export default writable(null) as Writable<null | App.Error>;
