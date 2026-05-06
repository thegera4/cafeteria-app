export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

// See the 'Use the Content Lake API' docs for more on API versions
// https://www.sanity.io/docs/api-versioning
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-05-04'
