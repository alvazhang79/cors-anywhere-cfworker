function handleOptions(request) {
  if (
    request.headers.get('Origin') !== null &&
    request.headers.get('Access-Control-Request-Method') !== null &&
    request.headers.get('Access-Control-Request-Headers') !== null
  ) {
    return new Response(null, {
      headers: corsHeaders,
    })
  } else {
    return new Response(null, {
      headers: {
        Allow: 'GET, HEAD, POST, OPTIONS',
      },
    })
  }
}
async function handleRequest(request) {
  let u = request.url
  let ru = u.split("?url=")
  if (ru.length >= 2) {
    let url = new URL(ru[1])

    let r = new Request(url, request);
    let response =  fetch(r, {
        headers: {
          'User-Agent': 'Cloudflare Workers'
        }
      })
    return response
  }else{
    let response = new Response("参数错误", {
          status: 405,
          statusText: 'Method Not Allowed',
        })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.append('Vary', 'Origin')
    return response
  }
}
addEventListener('fetch', event => {
  const request = event.request
  if (request.method === 'OPTIONS') {
    event.respondWith(handleOptions(request))
  } else if (
    request.method === 'GET' ||
    request.method === 'HEAD' ||
    request.method === 'POST'
  ) {
    event.respondWith(handleRequest(request))
  } else {
    event.respondWith(async () => {
      return new Response(null, {
        status: 405,
        statusText: 'Method Not Allowed',
      })
    })
  }
})
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Expose-Headers': 'Captcha',
  "Access-Control-Allow-Credentials": true
}