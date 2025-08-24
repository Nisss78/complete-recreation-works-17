/**
 * ブラウザ識別子を生成・取得するユーティリティ
 * LocalStorageにUUIDを保存し、同一ブラウザからの重複いいねを防ぐ
 */

/**
 * UUIDv4を生成する関数
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * ブラウザ識別子を取得（存在しない場合は生成）
 */
export const getBrowserIdentifier = (): string => {
  const STORAGE_KEY = 'browser_identifier';
  
  try {
    let identifier = localStorage.getItem(STORAGE_KEY);
    
    if (!identifier) {
      identifier = generateUUID();
      localStorage.setItem(STORAGE_KEY, identifier);
    }
    
    return identifier;
  } catch (error) {
    // LocalStorageが使えない環境（プライベートブラウジング等）の場合
    // セッションごとに一時的な識別子を生成
    console.warn('LocalStorage is not available, using temporary identifier');
    return `temp-${generateUUID()}`;
  }
};

/**
 * 特定のアイテムがいいね済みかどうかをローカルで確認
 */
export const isItemLikedLocally = (type: 'product' | 'article', itemId: number): boolean => {
  try {
    const storageKey = `liked_${type}s`;
    const likedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return likedItems.includes(itemId);
  } catch {
    return false;
  }
};

/**
 * いいね済みアイテムをローカルに保存
 */
export const saveLocalLike = (type: 'product' | 'article', itemId: number): void => {
  try {
    const storageKey = `liked_${type}s`;
    const likedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (!likedItems.includes(itemId)) {
      likedItems.push(itemId);
      localStorage.setItem(storageKey, JSON.stringify(likedItems));
    }
  } catch (error) {
    console.error('Failed to save local like:', error);
  }
};

/**
 * いいね済みアイテムをローカルから削除
 */
export const removeLocalLike = (type: 'product' | 'article', itemId: number): void => {
  try {
    const storageKey = `liked_${type}s`;
    const likedItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const index = likedItems.indexOf(itemId);
    if (index > -1) {
      likedItems.splice(index, 1);
      localStorage.setItem(storageKey, JSON.stringify(likedItems));
    }
  } catch (error) {
    console.error('Failed to remove local like:', error);
  }
};