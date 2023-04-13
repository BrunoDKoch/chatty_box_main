// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      status: number;
      error: {
        cause: string,
        message: string,
      }
    }
    interface Locals {
      user: {
        id: string;
        email: string;
        userName: string;
      }
      language: string
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
