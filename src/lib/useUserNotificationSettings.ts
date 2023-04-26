import type { UserNotificationSettings } from '@prisma/client';
import { type Writable, writable } from 'svelte/store';

export default writable(null) as Writable<null | UserNotificationSettings>;
