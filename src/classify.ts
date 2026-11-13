import type { Archive } from './archive';

export type GroupKey = 'onlyMe' | 'fans' | 'mutual';

export type Groups = Readonly<Record<GroupKey, readonly string[]>>;

export const GROUP_KEYS: readonly GroupKey[] = ['onlyMe', 'fans', 'mutual'];

export function classify({ followers, following }: Archive): Groups {
  const followerSet = new Set(followers);
  const followingSet = new Set(following);
  return {
    onlyMe: following.filter((id) => !followerSet.has(id)),
    fans: followers.filter((id) => !followingSet.has(id)),
    mutual: following.filter((id) => followerSet.has(id)),
  };
}
