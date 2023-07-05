// See https://kit.svelte.dev/docs/types#app

import type { ChatPreview, FriendResponse, UserPartialResponse } from '$lib/types/partialTypes';

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      status: number;
      cause: string;
      message: string;
    }
    interface Locals {
      user: {
        id: string;
        email: string;
        userName: string;
        avatar?: string;
        friends: FriendResponse[];
        friendRequests: { userAdding: UserPartialResponse }[];
        blocks: UserPartialResponse[];
        previews: ChatPreview[];
        isAdmin: boolean;
        status: '' | 'busy' | 'away';
      };
      language: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
