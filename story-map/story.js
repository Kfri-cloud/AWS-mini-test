const scenes = [...document.querySelectorAll('[data-scene]')];
const picker = document.querySelector('#scene-select');
const heading = document.querySelector('#scene-title');
const summary = document.querySelector('#scene-summary');
const counter = document.querySelector('#scene-counter');
const previous = document.querySelector('#scene-prev');
const next = document.querySelector('#scene-next');
const guide = document.querySelector('#full-guide');
const story = document.querySelector('#story-map');
let activeScene = 0;

function showScene(index, focus = false) {
    activeScene = index;
    const scene = scenes[index];
    scenes.forEach((item, position) => { item.hidden = position !== index; });
    picker.value = scene.id;
    heading.textContent = scene.dataset.title;
    summary.textContent = scene.dataset.summary;
    counter.textContent = `장면 ${index + 1} / ${scenes.length}`;
    previous.disabled = index === 0;
    next.disabled = index === scenes.length - 1;
    document.querySelector('#scene-position').textContent = `${index + 1} / ${scenes.length}`;
    if (focus) heading.focus();
}

function selectScene(index) {
    if (index < 0 || index >= scenes.length) return;
    history.pushState(null, '', `#${scenes[index].id}`);
    showScene(index, true);
    story.scrollIntoView({block:'start', behavior:'instant'});
}

function syncLocation() {
    const id = location.hash.slice(1);
    const index = scenes.findIndex(scene => scene.id === id);
    if (index >= 0) {
        showScene(index);
        story.scrollIntoView({block:'start', behavior:'instant'});
    } else if (id === 'story-map' || !id) {
        showScene(0);
    } else {
        const target = document.getElementById(id);
        if (target && guide.contains(target)) {
            guide.open = true;
            target.scrollIntoView({block:'start', behavior:'instant'});
        }
    }
}

picker.addEventListener('change', () => selectScene(picker.selectedIndex));
previous.addEventListener('click', () => selectScene(activeScene - 1));
next.addEventListener('click', () => selectScene(activeScene + 1));
window.addEventListener('hashchange', syncLocation);
showScene(0);
syncLocation();

const stages = [
    {node:0, title:'브라우저가 접속을 시작', from:'198.51.100.20:53124', to:'203.0.113.10:80', data:'TCP 연결 시작 (SYN)', note:'URL에 IP를 직접 입력했으므로 DNS 조회를 생략한다. 브라우저는 HTTP를 보내기 전에 TCP 연결부터 연다.'},
    {node:1, title:'IGW가 목적지 주소를 바꿈', from:'198.51.100.20:53124', to:'10.10.1.10:80', data:'TCP 연결 시작 (SYN)', note:'인터넷 게이트웨이는 EC2에 연결된 퍼블릭 IPv4를 EC2의 사설 IPv4로 매핑한다. 포트 80은 그대로다.'},
    {node:2, title:'보안 그룹이 인바운드 연결을 허용', from:'198.51.100.20:53124', to:'10.10.1.10:80', data:'TCP 연결 시작 (SYN)', note:'EC2 네트워크 인터페이스에 적용된 규칙이 출발지와 목적지 포트 TCP 80을 검사한다.'},
    {node:3, title:'Nginx가 HTTP 요청을 읽음', from:'198.51.100.20:53124', to:'10.10.1.10:80', data:'GET /', note:'TCP 연결 과정이 끝나면 브라우저가 GET /을 보낸다. Nginx는 설정에 따라 index.html을 찾는다.'},
    {node:3, title:'EC2가 외부로 응답을 보냄', from:'10.10.1.10:80', to:'198.51.100.20:53124', data:'200 OK + HTML', note:'서브넷의 기본 경로 0.0.0.0/0 → IGW를 따른다. 연결을 추적하는 SG는 허용된 요청의 응답을 통과시킨다.', back:true},
    {node:1, title:'IGW가 응답의 출발지 주소를 바꿈', from:'203.0.113.10:80', to:'198.51.100.20:53124', data:'200 OK + HTML', note:'IGW가 사설 출발지 주소를 같은 퍼블릭 IPv4로 바꾼다. 브라우저에는 처음 접속한 서버가 응답한 것으로 보인다.', back:true},
    {node:0, title:'브라우저가 HTML을 표시', from:'203.0.113.10:80', to:'198.51.100.20:53124', data:'200 OK + HTML', note:'브라우저가 응답을 읽고 화면을 그린다. CSS나 이미지가 있다면 추가 요청을 보낼 수 있다.', back:true}
];
const traceNetwork = document.querySelector('#trace-network');
const traceNodes = [...traceNetwork.children];
const tracePrevious = document.querySelector('#trace-prev');
const traceNext = document.querySelector('#trace-next');
const traceReset = document.querySelector('#trace-reset');
const traceFields = {
    index:document.querySelector('#trace-index'), title:document.querySelector('#trace-title'),
    from:document.querySelector('#trace-from'), to:document.querySelector('#trace-to'),
    data:document.querySelector('#trace-data'), note:document.querySelector('#trace-note')
};
let traceIndex = 0;
function showTrace(index) {
    traceIndex = index;
    const stage = stages[index];
    traceFields.index.textContent = `${index + 1} / ${stages.length} · ${stage.back ? '웹 응답' : '연결과 요청'}`;
    for (const field of ['title','from','to','data','note']) traceFields[field].textContent = stage[field];
    traceNetwork.dataset.direction = stage.back ? 'return' : 'request';
    traceNodes.forEach((node, position) => {
        node.classList.toggle('active', position === stage.node);
        if (position === stage.node) node.setAttribute('aria-current','step');
        else node.removeAttribute('aria-current');
    });
    tracePrevious.disabled = index === 0;
    traceReset.disabled = index === 0;
    traceNext.disabled = index === stages.length - 1;
}
tracePrevious.addEventListener('click', () => showTrace(traceIndex - 1));
traceNext.addEventListener('click', () => showTrace(traceIndex + 1));
traceReset.addEventListener('click', () => { showTrace(0); traceNext.focus(); });
showTrace(0);
