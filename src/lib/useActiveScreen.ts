import { type Writable, writable } from "svelte/store";

export default writable('friends') as Writable<'friends' | 'chat'>