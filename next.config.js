module.exports = {
  env: {
    NEXT_PUBLIC_API_HOST:'https://australia-southeast1-masterframing-staging.cloudfunctions.net/api',
    NEXT_PUBLIC_FIREBASE_API_KEY:'AIzaSyDz0ZGX2CYIuMjX0xchSvzKKDJ7JM_D0sQ',
    NEXT_PUBLIC_FIREBASE_APP_ID:'1:3393121351:web:8d9fc2347cfbe781ec9562',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:'masterframing-staging',
    PUBLIC_URL:""
  },
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      ...defaultPathMap
    }
  },
};
