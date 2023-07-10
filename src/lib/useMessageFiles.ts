import { type Writable, writable } from 'svelte/store';
import { connection } from './useSignalR';

function createMessageFiles() {
  const { set, subscribe, update } = writable([]) as Writable<
    { chatId: string; files: string[] }[]
  >;
  return {
    set,
    subscribe,
    update,
    init() {
      if (!localStorage) return;
      const savedMessageFiles = localStorage.getItem('messageFiles');
      if (savedMessageFiles) {
        this.update((m) => {
          m = JSON.parse(savedMessageFiles);
          return m;
        });
      }
      this.subscribe((m) => {
        localStorage.setItem('messageFiles', JSON.stringify(m));
      });
    },
    addFile(data: { chatId: string; filePath: string }) {
      const { chatId, filePath } = data;
      this.update((m) => {
        let savedChat = m.find((item) => item.chatId === chatId);
        if (!savedChat) {
          savedChat = { chatId, files: [filePath] };
          m.push(savedChat);
        }
        if (!savedChat.files.includes(filePath) && savedChat.files.length < 4)
          savedChat.files.push(filePath);
        return m;
      });
    },
    removeFile(data: { chatId: string; filePath: string }) {
      this.update((m) => {
        const existingChatData = m.find((info) => info.chatId === data.chatId);
        if (!existingChatData) return m;
        existingChatData.files = existingChatData.files.filter((f) => f !== data.filePath);
        return m;
      });
    },
    clearChat(chatId: string) {
      this.update((m) => m.filter((item) => item.chatId !== chatId));
    },
  };
}

export const messageFiles = createMessageFiles();

connection.on('fileAdded', (data: { chatId: string; filePath: string }) => {
  messageFiles.addFile(data);
});

connection.on('fileRemoved', (data: { chatId: string; filePath: string }) => {
  messageFiles.removeFile(data);
});
