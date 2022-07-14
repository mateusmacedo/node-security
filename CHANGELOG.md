> Refactoring

* refactor(deploy): optimize image build ([`846f411`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/846f411f7ec41553e9ee3701b027c247d6197fae))

# v0.2.0

## 2022-07-05

> Features

* feat(auth): define and register pf and pj provider ([`c72217b`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c72217b56b53684ba4377c3347aa2c7f59d1e2ab))

* feat(logger): ensure log error when execution trows ([`b17c317`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b17c3172d8abe17fc990fcc59a3ac2cd5c9df0cf))

> Tests

* test(auth): define and register pf and pj provider ([`c700393`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c7003934a75f0a021bb31c1f816a873902e94eda))

* test(logger): ensure log error when execution trows ([`22e1cc0`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/22e1cc0042d3d8b87404b34d6eb3b591cef4a088))

> Refactoring

* refactor(common): simplify code complexibilty ([`3913293`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/3913293251c539c8ffd46e036418be69eadfcece))

* refactor(logger): log error on log execution ([`8617afe`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/8617afe725b6e76a6a6ff0919606fcba0360255c))

* refactor(auth): move files ([`4abb8fc`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/4abb8fc9748fcae21f0268e036e8bb16e01d5e3a))

> Fixes

* fix(auth): request contracts and swagger decorator ([`7f1f951`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7f1f951c402f2b7be8bbbdb3117fc3eccf50b98b))

* fix(main): config module loader ([`ab42cd4`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/ab42cd408da6144f98640033a3aa90101a15cbe9))

# v0.1.0

## 2022-06-22

> Features

* feat(auth): refresh token strategy ([`585b157`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/585b157fde1009687e598de385a253243fdae044))

* feat(common): strategy explorer ([`febb31d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/febb31d73e1f14e8ff3b53f55430a6eda9b56397))

* feat(auth): ensure createAccessToken successfully ([`e9d4d82`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/e9d4d821bec0ba4903ce5852944cefc034c9db57))

* feat(login): ensure strategy registry register a grant strategy ([`b317cc1`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b317cc13c1200d0bd8700d0e2cd13bb337dc1741))

* feat(auth): ensure identity provider identify has call correctly ([`fcbe8d7`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/fcbe8d7f551650310ad2310cd867233c5f14e413))

* feat(auth): ensure provider register a client strategy ([`5aeef88`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/5aeef88b0df80861909a67d489de24b17af2d0b0))

* feat(auth): passport jwt auth strategy ([`0b2a3c2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/0b2a3c2b94d7af17511e65b82f035954f9ee2ca7))

* feat(auth): ensure identifyClient successfully ([`23290c5`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/23290c518fefc48e70763563a03ad126741887ce))

* feat(auth): ensure throw a error if client credentials is not valid ([`82f003a`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/82f003a8ca6cbb738d684847e6e2065c55fd522f))

* feat(auth): ensure ap provider is a derived instance of CognitoIdentityProviderClient ([`b2e8e15`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b2e8e15250b4e32699289f0d188a8d0fbb78c005))

* feat(auth): validate jwt token generate by pool ([`eec1ebb`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/eec1ebb4076f7676c59f376c2c9b3397193c3eb3))

* feat(login): ensure sut throw a internal error if error to occur ([`e13b953`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/e13b953c0ce9e42b90217bb7e081dbef172fa570))

* feat(auth): ensure getOauth2Response throw a error when provider throws ([`c574522`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c574522f0312d29ba4b9fc6d87a487afd2527939))

* feat(login): ensure strategy registry throw a error when not have a registered strategy ([`763e334`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/763e334d6aaac5e84d832895edb9d670e8d88548))

* feat(common): register and export estrategy explorer ([`930a675`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/930a675dfb9892356113bd6ce2a3908daad45ba7))

* feat(login): ensure sut get oauth2 response ([`ec28052`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/ec2805233480966abbd05edd60dba2ec19bc86ac))

* feat(auth): ensure identity provider throw a error if client not found ([`94c39d1`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/94c39d1c34afb52b03cc53407727a30af5caf71b))

* feat(login): ensure validate when has a strategy registered ([`6f55234`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/6f55234143e3cd7ff92d99fd7f9d12a548a534ba))

* feat(login): ensure throw a error when cannot validate grant type ([`13bd80f`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/13bd80f4e74e0bf45a99a8bc3848226b80e48890))

* feat(login): ensure get oauth2 response throw a error if grant type no regitered ([`0e78115`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/0e781155c65763536210939de584925756587328))

* feat(login): ensure return a response when success ([`448a256`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/448a256a1067e9b0cf57cf11f5128f86ccab6f27))

* feat(login): ensure strategyRegistry.validate calls correctly ([`c2972b3`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c2972b37764879a42255cca5589c8320f7623028))

> Tests

* test(auth): refresh token strategy ([`4fdb5c2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/4fdb5c210cd56b8e71bd187111ca5289884fc633))

* test(common): strategy explorer ([`dd56e4e`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/dd56e4e11d967b179bc95898c9b07eb62f7fbbb0))

* test(auth): ensure identifyClient successfully ([`7791d20`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7791d203ec9d9fd7316ac4d821f0964a802f2da9))

* test(auth): ensure provider register a client strategy ([`fcc55d2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/fcc55d22f2802a0c1ab2ce05ac17c6488e7523bd))

* test(auth): ensure createAccessToken successfully ([`b4649b2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b4649b28cf5a18ef6fc063ead0793e73230c6317))

* test(auth): ensure identity provider identify has call correctly ([`b1f76f2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b1f76f202bf6ea579ed67af7d207de7364d5368b))

* test(login): ensure strategy registry register a grant strategy ([`2f803a2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/2f803a2f724341b098aeb129c6ca521b80de5f9d))

* test(auth): ensure throw a error if client credentials is not valid ([`005b1c9`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/005b1c9e0b31436de95217fb4999f710f72cb202))

* test(auth): passport jwt auth strategy ([`abc4fb7`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/abc4fb73db80da07875727f6ccfdd4278b85bc9d))

* test(auth): validate jwt token generate by pool ([`4908404`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/490840454aa483b4f8ffb73953c0643ec6d773f3))

* test(auth): ensure return a oauth2response instance ([`0db358a`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/0db358ace17ff624fc3ccc65c6e4abcf49025d42))

* test(auth): ensure ap provider is a derived instance of CognitoIdentityProviderClient ([`730916d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/730916d392128d3ca46cbb5b3f18d254f7599c29))

* test(login): ensure sut get oauth2 response ([`520616d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/520616d14642bce14586f12ba79aac52bfa7eadd))

* test(login): ensure return a response when success ([`67b13c8`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/67b13c8c29f8836978fbae11fc542bb7435cfd17))

* test(login): ensure validate when has a strategy registered ([`38b8750`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/38b8750b35e23eb1a769ad0ad8e8b29b65cbe7ba))

* test(login): add more expects to grant execution flow ([`b7bead1`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b7bead1ad2c7c74cbed06c53a1161609a7b56792))

* test(login): ensure strategy registry no have strategies ([`ec49869`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/ec4986930fd7c318ec3f1d9d3b52cdcd8e94b0ad))

* test(login): ensure strategyRegistry.validate calls correctly ([`8df76f6`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/8df76f646f516c426d433cb25674ce36fff38e1d))

* test(auth): ensure getOauth2Response throw a error when provider throws ([`e526333`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/e526333815410659779884aa60da751cbed7bb78))

* test(auth): ensure no have client strategies registered ([`f79deae`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/f79deae3211d1062316928490a69c5a4c8c1c187))

* test(login): ensure throw a error when cannot validate grant type ([`7d117cf`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7d117cf414bdfefa5c02dc54521ae0c1867d98bd))

* test(auth): ensure identity provider throw a error if client not found ([`18c9d7d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/18c9d7dc991799ab7021cc74f89b9df312700f2a))

* test(auth): ensure return throws when provider throws ([`9bfc630`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/9bfc630b5f78c169a99ea5a2357662d71d7a7780))

* test(login): ensure get oauth2 response throw a error if grant type no regitered ([`392bd29`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/392bd2928cb86840b0b8972f03af740edb0bae55))

* test(login): ensure strategy registry throw a error when not have a registered strategy ([`45b0e1f`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/45b0e1fd9ee39a61f3becb0c2705857d9022ac6b))

* test(login): ensure sut throw a internal error if error to occur ([`d3379f3`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/d3379f39738873e8953ec1a68d2c15a7dd391b0d))

* test(login): ensure throw a error if strategyRegistry throws ([`c9e8eb7`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c9e8eb780877063df62e94c469571fbce4dac3aa))

* test(auth): grant user poll id is correct ([`7aeb6a2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7aeb6a23b8154b9a2964417fcf2944b3afae42f8))

> Refactoring

* refactor(observability): manual instrumentation ([`b7f19b3`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b7f19b3054bf5b44c6842b088922d9c290ddfcd4))

* refactor(auth): better names ([`efdadc3`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/efdadc31c9974dd6e11338dadfa70c50723481aa))

* refactor(auth): change request api ([`20419a7`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/20419a71192483ddba06d64738a8f4498177df42))

* refactor(auth): enforce excpetions throws ([`a41c558`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/a41c55842cb8d6ab65fd28762176ab41c0450600))

* refactor(auth): split methods ([`2a22026`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/2a2202605dae5399554d2025c939c6e4703ad577))

* refactor(auth): inject client and pool id as dependency ([`275da2b`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/275da2b265e1c4c76b770fbf62b2ba299c8b5094))

* refactor(login): clean code ([`348530d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/348530da670f32d2fd6953a77cc01c6c147bd634))

* refactor(login): clean code ([`5320d45`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/5320d45b015f7f3c5c9ca8caf4a92ee88f1f2819))

* refactor(login): blue phase ([`4349b55`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/4349b55a39b5c08d7dd84fc1461555f3f99f6f31))

* refactor(common): change to module service ([`b47727d`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b47727d07dfaf2faa8275698b551ca531267f713))

* refactor(auth): define exception to throw ([`7fc06da`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7fc06da3a55761d44010cf0372edb23899a32136))

* refactor(common): put test context to log or not ([`cddcc84`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/cddcc84808fca660beada221395bd6710527ac80))

* refactor(common): log sync and async executions ([`4156c22`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/4156c220638e2f675170627aa1cb1d57ead250bb))

* refactor(auth): change generics definition ([`7198f5e`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/7198f5e557db30f342cfe22dc1f6839643ec780b))

* refactor(auth): remove construtor to use helper ([`45ed19b`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/45ed19b8c40c8fb827875e460a247079f7277770))

* refactor(auth): define request obj for test ([`f70b5c4`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/f70b5c4e07c99fec580da8ff92c0177e6a5ab81a))

* refactor(auth): correct dto decorators ([`db7c7bd`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/db7c7bd5db72a2561aefc924fa94cf23ba70d827))

* refactor(auth): change plain object to dto exposes ([`b74c9e6`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b74c9e6a814ca430e50f12c22e09460c71f4f3aa))

* refactor(auth): enforce types ([`74e005c`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/74e005cf42c33d488fb66d87e1cc254952561c7d))

* refactor(login): generics interfaces ([`676f0d6`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/676f0d6df1a2e962cd587d250a6fd244924eef53))

* refactor(auth): define interface for jwt token ([`2361210`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/2361210be9427c0a296308764a567db06be75abb))

* refactor(login): exception for invalid grant ([`72facb3`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/72facb3feb94db4fbd50c3a80b700f1a6c5f0a58))

* refactor(auth): catch exceptions subtypes ([`5d2b288`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/5d2b2881fc0fb8c9a11ca08d1a2ef54f6cb5b208))

* refactor(auth): remove duplicated code ([`98eec32`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/98eec324878d39e00e764204199e9d2dfa5987ab))

* refactor(auth): define interface for idenfify client ([`f727eb1`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/f727eb1e642bf43b603ba44006c97f03ce639323))

* refactor(auth): move files ([`5fb8678`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/5fb8678cfd0fa6815935589e6d58ad3842d7324a))

* refactor(login): better name ([`5774881`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/5774881abb3107ab5c2b8f287fccf793018927ab))

* refactor(auth): change name to context component ([`cb0e067`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/cb0e067827065cd5ebae1b5c4d605cb7bb0cada5))

* refactor(auth): pass grant type to error ([`d45af65`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/d45af658f3336f47c4d5b660b91e005f7e91bbca))

* refactor(common): module register ([`aad55ba`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/aad55baca16e497010e8a91dafb11a19094cc42e))

* refactor(auth): remove unnecessary implementation ([`c7de73e`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/c7de73e1c20625c00295a3d8b0cbb4f8b8d045d5))

* refactor(auth): define a type on call expore ([`30f2a2b`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/30f2a2b09b1ecd61a3546b311874b7cd9a9627fa))

* refactor(auth): name semantic ([`b0c80ba`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/b0c80ba5e60d73815638eabd2a8659ea9365fc08))

> Fixes

* fix(config): config module init vars ([`39574f9`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/39574f9b56f031959199d196024a04dbb1a37d2d))

* fix(auth): move provider for correct key on module compile ([`4b41182`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/4b41182b338088ce50eca227988c1c8425896700))

* fix(common): correct logic for expand variables ([`a681b5a`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/a681b5a4e21cef25160ba98ea90043c8e847719f))

* fix(config): correct env parse ([`31d5da2`](https://ssh.dev.azure.com/git@ssh.dev.azure.com:v3/QsaudeDevOps/DigitalWorkPlace/node-security/commit/31d5da2876fc7cefd2f240b9054233d8e86de79c))
