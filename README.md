# M3-1 | 내가 만든 웹사이트를 인터넷에 올려 누구나 쓰게 하기

> Codyssey Basic Cloud & AI API · AWS 실습 평가 및 증빙 템플릿
>
> **진행 현황 (2026-11-21): 서울 리전 VPC·EC2·SSH·Nginx 구축과 외부 브라우저 접속 검증 성공. 리소스 정리는 아직 미실시.** 캡처 원본은 대화에서 확보했으나 GitHub 증빙 이미지 업로드는 별도로 필요합니다.

## 실습 전 읽기

[AWS 미션 스토리맵 열기](https://aws-mini-test-study-guide.kfri-2-kfri.chatgpt.site/#story-map) · [GitHub 소스 보기](story-map/)

웹 서버 기초부터 AWS 연결망, 요청·응답 추적, 접속 검증과 제출까지 6개 장면으로 볼 수 있습니다. 로컬에서는 저장소를 내려받아 `story-map/index.html`을 브라우저로 열면 됩니다.

[웹 서버의 기본부터 AWS EC2까지](docs/server-to-aws.md)에서 내 컴퓨터로 HTTP 요청을 보내 보고, 같은 페이지를 EC2에서 공개할 때 주소, 라우팅, 보안 그룹이 어떻게 연결되는지 확인하세요.

### 네트워크 기초 학습 노트

[IP 주소 · 서브넷 마스크 · CIDR · Route Table 개념 정리](docs/network-fundamentals.md) — VPC·IGW·트래픽과 주소 범위, 기본 경로의 차이를 예제로 정리했습니다.

## 평가 기준: 항목 1~4 (총 17문항)

**[평가 항목 1~4 전체 보기](docs/evaluation-criteria.md)** — 잘린 제목의 첫 5문항은 모두 **항목 1**입니다. 항목 1은 구현·검증·정리 여부, 항목 2~4는 구성 설명·설계 원리·문제 해결 평가입니다.

아래 표의 1~4는 **평가 항목 번호가 아니라 PDF 원문에 지정된 제출물 4종의 번호**입니다.

## 제출물 (원문 3-1.pdf 2쪽)

| 구분 | 파일 | 필수 증빙 |
|---|---|---|
| 1. 아키텍처 | [docs/architecture.md](docs/architecture.md), [docs/architecture.svg](docs/architecture.svg) | VPC, Public Subnet, IGW, Route Table, EC2, SG 및 외부 요청 흐름; 최종 PNG/PDF로 내보내기 |
| 2. 외부 접속 | 아래 '접속 검증' + `docs/evidence/` 스크린샷 | 방식 A/B 중 하나와 외부 응답 |
| 3. 트러블슈팅 | [docs/troubleshooting.md](docs/troubleshooting.md) | 실제 오류 1건 이상: 증상→가설→검증→조치→결과→재발 방지 |
| 4. 정리 | [docs/cleanup-checklist.md](docs/cleanup-checklist.md) | EC2/EBS/EIP/IGW/VPC 최소 5종 및 추가 요금 리소스 |

## 서울 리전 전환 결과 (2026-11-21)

**해결 완료:** 초기 가입 환경에서는 시드니 프로젝트 할당 및 서울 접근 제한 경고가 있었으나, 사용자가 Google 신속 가입 대신 Google 계정 가입 방식으로 다시 진행한 후 서울 리전 VPC·EC2 콘솔을 정상 이용했습니다. 이는 사용자 경험으로 확인한 해결 사례이며 모든 AWS 계정에 동일한 가입 방식 제약이 존재한다고 일반화하지 않습니다.

[실제 트러블슈팅 보고서](docs/seoul-region-troubleshooting.md) · [실습 및 평가 현황](docs/pre-cleanup-evaluation.md)

## 실습 환경 / 실제 검증 기록

| 항목 | 실제 사용값 |
|---|---|
| AWS Region | `ap-northeast-2` (서울) |
| VPC | `aws-mini-test-vpc` / `10.0.0.0/16` |
| Public Subnet | `aws-mini-test-subnet-public1-ap-northeast-2a` / `10.0.0.0/20` |
| Internet Gateway | `aws-mini-test-igw` / `igw-01fef922fafa9c6cb` |
| Public Route Table | `aws-mini-test-rtb-public` / `rtb-05c3b69984ea7f365` |
| Route | `10.0.0.0/16 → local`, `0.0.0.0/0 → IGW` (활성) |
| EC2 | Ubuntu 24.04 LTS · `t3.micro` · `i-0b54a3173ed64e7e3` |
| 사설 IP / 당시 퍼블릭 IP | `10.0.7.102` / `3.35.0.156` |
| 웹 서버 | Nginx 1.24.0 · `curl -i http://localhost/` → HTTP 200 OK |
| SG | `aws-mini-test-sg` · TCP 22: 특정 IP/32, TCP 80: 0.0.0.0/0 |
| 외부 검증 | **A 방식 성공** · 2026-11-21 21:57 KST · Welcome to nginx! |
| IAM·태그 세부 정책 | 평가용 별도 IAM 주체 및 실제 태그는 검증 필요. 콘솔 화면의 `root` 사용은 원문 제한사항과 비교 필요 |
| 정리 | EC2/EBS/EIP/IGW/VPC **삭제 미확인** |

[17개 평가 질문별 판정표와 제출물 현황](docs/pre-cleanup-evaluation.md) · [아키텍처 구조](docs/architecture.md)

**보안:** 퍼블릭 IP, 이름, SG 규칙은 공개해도 되는 범위만 기록합니다. AWS 액세스 키, 비밀 키, SSH 개인키(PEM), 계정 번호, 민감 로그는 Git에 절대 올리지 마세요. 공개 저장소의 캡처는 마스킹 후 사용하세요.

## 실행/설정 보조 체크리스트 (평가 항목 1의 5문항과 별개)

- [x] VPC 1개, Public Subnet 1개 생성
- [x] IGW를 VPC에 연결
- [x] Public Subnet이 연동된 Route Table에 `0.0.0.0/0 → IGW` 등록
- [x] Public Subnet의 EC2에 퍼블릭 IPv4 할당, SSH 접속 성공
- [x] 웹 서버 실행, EC2 안에서 `curl -i http://localhost/` 응답 200 확인
- [x] SG 인바운드: TCP 80 = `0.0.0.0/0`, TCP 22 = **특정 공인 IP/32만** 확인
- [ ] IAM은 EC2/VPC/SG 등의 실습 필요 작업으로만 제한하며 AdministratorAccess 사용 안 함 (실제 확인 필요)
- [x] 외부 검증 A 성공, 실제 화면과 접속 정보 확인 (GitHub 이미지 업로드 별도)
- [x] 트러블슈팅 실제 1건 이상 기록
- [ ] 종료 후 리소스 정리 증빙 (최소 5종) 완료

## 서버 배포 및 테스트 예시 (Ubuntu + Nginx)

```bash
# 1. (로컬 컴퓨터) 본인 키 경로, 퍼블릭 IP로 변경
chmod 400 /path/to/lab-key.pem
ssh -i /path/to/lab-key.pem ubuntu@<PUBLIC_IP>

# 2. (EC2 내부) 패키지 설치 및 시작
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo systemctl status nginx --no-pager

# 3. (EC2 내부) localhost 응답 확인
curl -i http://localhost/
```

Amazon Linux이면 패키지 관리 명령, SSH 사용자(`ec2-user`)가 달라집니다. 로컬의 SSH `chmod`는 Windows PowerShell에는 그대로 적용되지 않을 수 있습니다.

## 외부 접속 검증 — **A 선택(권장·간단)**

- 방식: **A. 브라우저 http://<PUBLIC_IP> 접속 후 페이지 표시**
- 실제 사용 URL: `http://3.35.0.156/` (실습 시점의 퍼블릭 IPv4; 삭제 후 접속되지 않을 수 있음)
- 검증 시각(KST): 2026-11-21 21:57
- 결과: **성공** · 외부 Chrome에서 `Welcome to nginx!` 표시
- 내부 HTTP: `curl -i http://localhost/` → HTTP 200 OK
- 증빙: 대화에서 캡처 확보, GitHub `docs/evidence/external-browser.png` 업로드는 별도
- 브라우저에서 나온 화면과 주소창(필요 시 일부 마스킹)을 캡처합니다.

대체 방식 B: `curl -i http://<PUBLIC_IP>/health`에서 HTTP 200 및 고정 문구 `OK`를 **실제로 서버에 /health 경로를 구현한 뒤** 검증. Nginx 기본 설치만으로는 `/health`가 자동 제공되지 않습니다.

## 평가 설명 자료

문답 및 상황 대처: [docs/evaluation-guide.md](docs/evaluation-guide.md).

### 통합 평가자료 다운로드

- [평가·실습 자료 PDF (8쪽)](docs/evaluation-handbook.pdf)
- [수정 가능한 Markdown 원본](docs/evaluation-handbook.md)

항목 1~4의 17개 평가 기준, 제안 배점, 실습 가이드, 예상 답변, 장애 대응 및 리소스 정리 체크리스트를 묶었습니다. 배점은 공식 기준이 아닌 제안안이며 실제 실습 결과는 기입란으로 남겨두었습니다.

통합 자료의 실습 예제는 **Amazon Linux 2023 + B 방식(`/health`)**입니다. 위 README의 **Ubuntu + A 방식(브라우저)**과는 선택 가능한 별도 예제입니다. 실제 사용하는 OS와 검증 방식 하나에 맞춰 명령·설정·증빙을 작성하세요. 태그 예시도 실제 프로젝트에서 정한 규칙 하나로 통일하세요.

## 실습 후 정리 및 제출

[실습 후 가이드](docs/after-lab.md)에 따라 EC2가 살아 있을 때 외부 접속 증빙을 남기고, 실제 구성과 장애 대응을 기록하세요. AWS 리소스를 정리한 뒤 제출물 4종을 평가 기준에 대조할 수 있습니다.

> 실제 AWS 구성 및 접속 성공은 사용자 제공 콘솔 캡처·터미널 로그를 근거로 기록했습니다. 리소스 삭제 및 과금 정리는 아직 확인되지 않았습니다.
