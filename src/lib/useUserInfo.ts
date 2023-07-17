import type { UserPersonalInfo } from './types/partialTypes';
import { friends, previews, friendRequests, blockedUsers } from './useSignalR';

export default function (data: UserPersonalInfo) {
  friends.set(data.friends);
  friendRequests.set(data.friendRequests);
  blockedUsers.set(data.blocks);
  previews.set(data.previews);
}
