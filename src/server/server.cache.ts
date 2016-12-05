

var _fakeLRUcount = 0;
export const fakeDemoRedisCache = {
  _cache: {},
  get: (key: any) => {
    let cache: any = (fakeDemoRedisCache._cache as any)[key as any];
    _fakeLRUcount++;
    if (_fakeLRUcount >= 10) {
      fakeDemoRedisCache.clear();
      _fakeLRUcount = 0;
    }
    return cache;
  },
  set: (key: any, data: any) => (fakeDemoRedisCache._cache as any)[key as any] = data,
  clear: () => fakeDemoRedisCache._cache = {}
};
