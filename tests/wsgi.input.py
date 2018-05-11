def app(env, start_response):
    start_response('200 Ok', [('Content-Type', 'text/plain')])
    data = env['wsgi.input'].read()
    return [data]