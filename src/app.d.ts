// See https://kit.svelte.dev/docs/types#app

import type { UserPersonalInfo } from '$lib/types/partialTypes';

// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      status: number;
      cause: string;
      message: string;
    }
    interface Locals {
      user?: UserPersonalInfo;
      language: string;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
