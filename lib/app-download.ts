export type AppDownloadLinks = {
  ios: string | null;
  android: string | null;
  hasAny: boolean;
};

export function getAppDownloadLinks(): AppDownloadLinks {
  const ios = process.env.NEXT_PUBLIC_COVMERC_IOS_APP_URL?.trim() || null;
  const android = process.env.NEXT_PUBLIC_COVMERC_ANDROID_APP_URL?.trim() || null;

  return {
    ios,
    android,
    hasAny: Boolean(ios || android)
  };
}
