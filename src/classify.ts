import type { Archive } from './archive';

export type GroupKey = 'onlyMe' | 'fans' | 'mutual';

export type Groups = Readonly<Record<GroupKey, readonly string[]>>;

export const GROUP_KEYS: readonly GroupKey[] = ['onlyMe', 'fans', 'mutual'];

export const GROUP_LABELS: Readonly<Record<GroupKey, { title: string; hint: string }>> = {
  onlyMe: { title: '나만 팔로우', hint: '내가 팔로우하는데 상대는 나를 팔로우하지 않아요' },
  fans: { title: '나를 팔로우만', hint: '상대는 나를 팔로우하는데 나는 안 해요' },
  mutual: { title: '맞팔', hint: '서로 팔로우하고 있어요' },
};

export function classify({ followers, following }: Archive): Groups {
  const followerSet = new Set(followers);
  const followingSet = new Set(following);
  return {
    onlyMe: following.filter((id) => !followerSet.has(id)),
    fans: followers.filter((id) => !followingSet.has(id)),
    mutual: following.filter((id) => followerSet.has(id)),
  };
}
