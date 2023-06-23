import { type Writable, writable } from 'svelte/store';

// Using this array to get the active tab and translate it in the component, as well as set the active css class
export const tabs = ['friends.available', 'friends.pending', 'friends.blocked'] as const;

export default writable('friends.available') as Writable<(typeof tabs)[number]>;
