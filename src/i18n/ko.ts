/**
 * Korean (source of truth for keys).
 * `page` is filled into index.html at build/dev time; `app` ships in the bundle for text set at runtime.
 * Page strings may use <b>…</b> and <nb>…</nb> (a run that should not wrap).
 */

export const page = {
  'meta.title': '맞팔체크 · 나 혼자 팔로우 중인 X 계정 확인',
  'meta.description': 'X(트위터) 기록 파일로 나를 팔로우하지 않는 계정을 찾아요. 팔취·언팔한 계정도 여기에 함께 나와요. 로그인 없이, 파일은 기기 밖으로 나가지 않아요.',
  'meta.appName': '맞팔체크',
  'og.title': '나 혼자 팔로우 중인 X 계정, 몇 개일까?',
  'og.description': 'X 기록 파일 하나로 확인해요. 비밀번호는 묻지 않고, 데이터를 받는 서버도 없어요.',

  'nav.language': '언어',
  eyebrow: '맞팔체크 · X(트위터)',
  title: '<nb>나 혼자 팔로우 중인 계정,</nb> <nb>몇 개일까?</nb>',
  lede: 'X 기록 파일 하나로 확인해요. 오늘 신청하면 보통 내일 파일이 와요.',
  'privacy.title': '<nb>데이터를 받는</nb> <nb>서버가 없어요</nb>',
  'privacy.note': '비밀번호를 묻지 않고, 파일을 저장하지도 않아요. 그래서 X가 직접 만들어 주는 기록 파일이 필요해요. 파일은 이 브라우저 안에서만 읽고 창을 닫으면 사라져요.',
  'privacy.warn': '맞팔 확인하자고 X 비밀번호를 남에게 주지 마세요.',

  'upload.heading': '기록 파일 넣기',
  'request.title': 'X에 내 기록 파일 요청하기',
  'request.text': 'X 앱 <b>설정 및 개인정보</b>에서 아래 순서로 눌러요. 본인 확인을 위해 X가 비밀번호와 인증 코드를 물어봐요.',
  'request.shotsLabel': '기록 파일 요청 화면 순서, 옆으로 넘겨 보기',
  'request.shot1': '계좌',
  'request.shot1Alt': 'X 설정 화면. 맨 위 계좌 메뉴가 빨간 테두리로 표시돼 있어요.',
  'request.shot2': '다운로드 및 보관',
  'request.shot2Alt': '내 계정 화면. 다운로드 및 보관 메뉴가 빨간 테두리로 표시돼 있어요.',
  'request.shot3': '기록 파일 요청하기',
  'request.shot3Alt': '다운로드 및 보관 화면. 기록 파일 요청하기 버튼이 빨간 테두리로 표시돼 있어요.',
  'request.cta': 'X 앱에서 열기',
  'request.fallback': 'X 앱이 안 열리면 웹에서 열기',
  'request.hint': '위 두 번째 화면(다운로드 및 보관)으로 바로 가요. X 앱이 없으면 웹으로 열려요.',

  'wait.title': '하루쯤 기다리기',
  'wait.text': '파일이 준비되면 X 알림과 이메일로 알려줘요. 알림을 눌러 zip을 내려받은 뒤 이 페이지로 돌아오세요.',
  'install.title': '홈 화면에 추가',
  'install.sub': '아이콘을 눌러 앱처럼 바로 열 수 있어요.',
  'wait.tip1': '내려받을 때 X가 로그인과 본인 확인을 한 번 더 요청할 수 있어요.',
  'wait.tip2': '사진·영상까지 들어 있어 용량이 클 수 있어요. <nb>Wi-Fi에서</nb> 받는 걸 권해요.',
  'wait.tip3': '받은 zip은 아이폰은 <b>파일</b> 앱의 <b>다운로드</b>, 안드로이드는 <b>내 파일</b>의 <b>Download</b> 폴더에 있어요.',

  'upload.title': '받은 zip 넣기',
  'drop.sub': '압축을 풀었다면 <nb>follower.js · following.js</nb> 두 파일',
  'upload.safe': '파일은 이 브라우저 안에서만 읽어요',

  'result.reset': '다른 파일',
  'result.label': '결과',
  'result.options': '표시할 목록',

  'notes.ids': '기록 파일에는 @아이디가 들어 있지 않아서 숫자 계정 ID로 보여요. 줄을 누르면 해당 프로필이 열려요.',
  'notes.suspended': '탈퇴하거나 정지된 계정도 팔로워에서 빠지기 때문에 "나만 팔로우"에 섞일 수 있어요.',
  'notes.snapshot': '기록 파일을 만든 시점 기준이에요. 그 뒤의 변화는 반영되지 않아요.',
  'notes.unofficial': 'X와 관계없는 개인 프로젝트예요.',
} as const;

export const app = {
  'drop.title': 'zip 파일 선택',
  'drop.reading': '읽는 중…',
  'install.add': '추가하기',
  'install.close': '닫기',
  'install.nudge': '파일 알림이 오면 바로 열 수 있게 추가해 두세요.',
  'wait.noteInstall': '요청했다면 이제 기다리기만 하면 돼요. 홈 화면에 추가해 두면 다시 찾기 쉬워요.',
  'wait.noteBookmark': '요청했다면 이제 기다리기만 하면 돼요. 이 페이지를 즐겨찾기해 두면 다시 찾기 쉬워요.',

  'guide.ios.1': 'Safari 주소창 옆의 {share} 공유 버튼을 눌러요. 안 보이면 ⋯ 를 먼저 눌러요.',
  'guide.ios.2': '메뉴를 내려서 "홈 화면에 추가"를 눌러요.',
  'guide.ios.3': '오른쪽 위 "추가"를 누르면 홈 화면에 아이콘이 생겨요.',
  'guide.iosChrome.1': 'Chrome 주소창 오른쪽의 {share} 공유 버튼을 눌러요.',
  'guide.iosChrome.2': '목록을 아래로 내려서 "홈 화면에 추가"를 눌러요.',
  'guide.iosChrome.3': '오른쪽 위 "추가"를 누르면 홈 화면에 아이콘이 생겨요.',
  'guide.inapp.1': '카카오톡·인스타그램 같은 앱 안의 브라우저에서는 홈 화면에 추가할 수 없어요.',
  'guide.inapp.2': '오른쪽 위나 아래의 ⋯ 메뉴에서 "다른 브라우저로 열기"(아이폰은 "Safari로 열기")를 눌러요.',
  'guide.inapp.3': '열린 Safari나 Chrome에서 이 버튼을 다시 눌러 주세요.',
  'guide.manual.1': '브라우저 메뉴(⋮ 또는 ⋯)에서 "홈 화면에 추가"나 "앱 설치"를 눌러요.',
  'guide.manual.2': '메뉴에 없다면 이 페이지를 즐겨찾기(북마크)에 추가해 두세요.',

  'error.format': '파일 형식을 읽지 못했어요. X 기록 파일의 원본 .js 파일인지 확인해 주세요.',
  'error.corrupt': '파일 내용이 손상됐거나 X 기록 파일 형식이 아니에요.',
  'error.zip': 'zip 파일을 열지 못했어요. 다운로드가 끝까지 됐는지 확인해 주세요.',
  'error.notFound': 'follower.js와 following.js를 찾지 못했어요. 받은 zip을 그대로 넣거나 data 폴더의 두 파일을 넣어 주세요.',
  'error.noFollowers': 'follower.js가 없어요. following.js와 함께 넣어 주세요.',
  'error.noFollowing': 'following.js가 없어요. follower.js와 함께 넣어 주세요.',
  'error.generic': '파일을 읽는 중 문제가 생겼어요. 다시 시도해 주세요.',

  'result.stats': '팔로워 {followers} · 팔로잉 {following}',
  'group.onlyMe.title': '나만 팔로우',
  'group.onlyMe.hint': '내가 팔로우하는데 상대는 나를 팔로우하지 않아요',
  'group.fans.title': '나를 팔로우만',
  'group.fans.hint': '상대는 나를 팔로우하는데 나는 안 해요',
  'group.mutual.title': '맞팔',
  'group.mutual.hint': '서로 팔로우하고 있어요',
  'group.empty': '해당하는 계정이 없어요',
  'group.tapHint': '누르면 프로필이 열려요',
  'group.copyAll': 'ID 전체 복사',
  'group.copied': '{n}개 복사됨',
  'group.copyBlocked': '복사가 막혀 있어요',
  'group.more': '{n}개 더 보기 · 남은 {rest}개',
  'row.open': '계정 {id} 프로필 열기',
  'row.go': '프로필 ↗',
} as const;

export type PageKey = keyof typeof page;
export type AppKey = keyof typeof app;
export type PageMessages = Readonly<Record<PageKey, string>>;
export type AppMessages = Readonly<Record<AppKey, string>>;
