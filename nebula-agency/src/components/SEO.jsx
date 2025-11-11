import { Helmet } from 'react-helmet-async'

const site = {
  name: 'Nebula Agency',
  domain: 'https://nebulaagency.net',
  twitter: '@nebula_agency',
}

export default function SEO({
  title = site.name,
  description = 'Nebula Agency is a futuristic digital studio crafting immersive, galaxy-inspired websites and brands. We blend creativity, technology, and design to help businesses shine across the digital universe. ',
  path = '/',
  image = '/logo.svg',
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
  jsonLd,
}) {
  const url = `${site.domain}${path}`
  const fullTitle = title ? `${title} · ${site.name}` : site.name
  const robots = noindex ? 'noindex,nofollow' : 'index,follow'

  const imageUrl = image?.startsWith('http') ? image : `${site.domain}${image}`

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site.twitter} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
