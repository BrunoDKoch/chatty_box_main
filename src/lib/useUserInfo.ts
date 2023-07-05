import type { UserConnectionCallInfo } from './types/partialTypes';
import { friends, previews, friendRequests, blockedUsers } from './useSignalR';

export default function (data: UserConnectionCallInfo) {
  friends.update((f) => {
    if (!f.length) return data.friends;
    const newFriendsArray = f.map((friend) => {
      const incomingFriendData = data.friends.find((fr) => fr.id === friend.id)
      if (!incomingFriendData) return friend;
      return incomingFriendData;
    });
    return newFriendsArray;
  });
  friendRequests.set(data.friendRequests);
  blockedUsers.set(data.blocks);
  previews.set(data.previews);
}
