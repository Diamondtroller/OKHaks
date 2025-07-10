export type Item = {
  allowedMaps?: string;
  amb?: string;
  /**
   * Field ontains:
   * - width, height of the frame,
   * - number of frames
   * - animation type:
   *   - loop: loop without pauses
   *   - rand: loop with random pauses in-between
   */
  animation?: string;
  b?: string;
  /** Designates whether binary animation is used (preprocessed flash)*/
  ba?: string;
  bfs?: string;
  bonusType?: string;
  buildItems?: string;
  dimension?: string;
  discount?: string;
  friendReward?: string;
  iconClass?: string;
  itemClass?: string;
  layer?: string;
  level?: string;
  lifes?: string;
  movable?: string;
  petClass?: string;
  price?: string;
  quests?: string;
  reward?: string;
  sellPrice?: string;
  sellProtection?: string;
  showItems?: string;
  size?: string;
  social?: string;
  store?: string;
  storeType?: string;
  subtype: string;
  superPrice?: string;
  timer?: string;
  transform?: string;
  travel?: string;
  type: string;
  v?: string;
  values?: string;
  walkable?: string;
  walkingMultiplier?: string;
}

export type Items = {
  items: Record<number, Item>;
};
