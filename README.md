# SupersetUiAngular

## Python Setup

- to enable cors in python please install `pip3 install apache-superset[cors]` or `pip install apache-superset[cors]` (depending on python@2 or python@3 version you have on your computer)
- in `.superset-config.py` file add props to configure CORS (origins can have `*` also) : 
  - `ENABLE_CORS = True`
  - `CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['http://localhost:4200', 'http://localhost:8088']
    }`
- IMPORTANT! To be able to embed dashboard via iframe set `FEATURE_FLAGS = {"EMBEDDED_SUPERSET": True }` in `.superset-config.py`
- `GUEST_ROLE_NAME = "Gamma" SESSION_COOKIE_SAMESITE = None
  ENABLE_PROXY_FIX = True PUBLIC_ROLE_LIKE_GAMMA = True` properties are responsible for granting access for guest user to be able to interact with dashboard

## Embedding details

[Embedding dashboard to app (medium)](https://medium.com/@khushbu.adav/embedding-superset-dashboards-in-your-react-application-7f282e3dbd88)

## Additional configs in Angular

- I used `proxy.conf.json` file as I had CORS issues accessing Dashboard API from Angular App
- I added `X-CSRF-Token` header and `csrf-token` API call as it is required to get `guest-token` (This is not described in medium article, fount this in [Swagger](http://localhost:8088/swagger/v1))

## Superset start
- `docker-compose -f docker-compose-non-dev.yml up --build`
- username: `admin`, password: `admin`
