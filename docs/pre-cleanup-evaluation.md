# 미션 3-1 — 실습 완료 현황 및 평가 대비표 (리소스 정리 전)

> 작성 기준: 2026-11-21 (KST), 사용자가 공유한 AWS 화면 및 SSH/Nginx 로그. 실제 AWS API에 접속해 독립적으로 재검증한 결과는 아닙니다. **리소스 삭제는 아직 확인되지 않았습니다.**

## 1. 실습 환경 (확인된 값)

| 구성 | 기록 | 근거 |
|---|---|---|
| Region | 서울 `ap-northeast-2` | VPC/EC2 콘솔 |
| VPC | `aws-mini-test-vpc` / `vpc-07ec1b64848b6e743` | VPC 상세 화면 |
| VPC CIDR | `10.0.0.0/16` | VPC CIDR 탭 |
| Public Subnet | `aws-mini-test-subnet-public1-ap-northeast-2a` / `subnet-0eb5849e628309ee5` | Route Table 연결 및 EC2 네트워크 설정 |
| Public Subnet CIDR | `10.0.0.0/20` | EC2 네트워크 설정 캡처 (VPC의 /16과 구분) |
| Route Table | `aws-mini-test-rtb-public` / `rtb-05c3b69984ea7f365` | 라우팅 탭 |
| Route 1 | `10.0.0.0/16 → local` (활성) | 라우팅 탭 |
| Route 2 | `0.0.0.0/0 → igw-01fef922fafa9c6cb` (활성) | 라우팅 탭 |
| IGW | `aws-mini-test-igw` | VPC 리소스 맵 |
| EC2 | `i-0b54a3173ed64e7e3` / `t3.micro` / Ubuntu 24.04 LTS | EC2 인스턴스 목록·SSH 로그 |
| EC2 사설/퍼블릭 IP | `10.0.7.102` / `3.35.0.156` | SSH 로그 / EC2 목록 |
| 보안 그룹 | `aws-mini-test-sg` / `sg-07168eda4aaeeada5` | SG 인바운드 탭 |
| SSH 인바운드 | TCP 22 ← `121.135.181.46/32` | 실제 SG 화면 |
| HTTP 인바운드 | TCP 80 ← `0.0.0.0/0` | 실제 SG 화면 |
| EBS | 루트 볼륨 8 GiB gp3 (생성 화면) | 실제 잔존/삭제 여부는 후속 확인 |
| Nginx | nginx/1.24.0 (Ubuntu) | 터미널 로그 |
| 외부 접속 | **A 방식**: `http://3.35.0.156/`, Welcome to nginx! 표시 | 외부 Chrome 브라우저 캡처 (2026-11-21 21:57 KST) |
| 내부 응답 | `curl -i http://localhost/` → **HTTP/1.1 200 OK** | 터미널 출력 2026-11-21 21:55 KST |

**미확인:** 실습용 IAM 사용자/Role 최소권한 부여 여부, 종료 전 EC2 상태 검사 최종 2/2, 최종 태그 일치, EIP 할당 여부, Billing, 리소스 삭제 여부.

## 2. 공식 제출물 4종과 현재 상태

| 제출물 | 원문 규격 | 현재 판정 | 다음 작업 |
|---|---|---|---|
| ① 아키텍처 | `docs/architecture.png` 또는 `.pdf` 1장 | **부분 완료**: 실제 리소스 값으로 [설계 문서](architecture.md)와 SVG 구성 | PNG/PDF 파일로 출력하여 저장소에 업로드 |
| ② 외부 접속 증빙 | README에 A/B 방식·URL 명시 + 화면 1장 이상 | **검증 성공**: A 방식 페이지 정상 표시, 내부 curl 200 | 개인정보를 가린 캡처를 `docs/evidence/external-browser.png`로 업로드 |
| ③ 트러블슈팅 | `docs/troubleshooting.md` 또는 pdf 1개, 최소 1건 | **문서 있음**: 서울 접근 제한 → 가입 방식 변경 → 해결 | [사례 문서](seoul-region-troubleshooting.md)와 캡처 업로드 확인 |
| ④ 리소스 정리 | `docs/cleanup-checklist.md` | **미완료**: 삭제 전 | EC2/EBS/EIP/IGW/VPC 실측 점검·삭제·기록 |

## 3. 평가 항목 1~4 (총 17문항) — 상태

평가 항목과 위 제출물 4종의 숫자는 다른 분류입니다.

| 번호 | 평가 질문 요약 | 상태 | 근거/보완 |
|---|---|---|---|
| **1-1** | VPC·Public Subnet·IGW·기본 Route | **구성 확인** | VPC 리소스 맵, 활성 경로 2개 |
| **1-2** | EC2 SSH 및 웹 서버 | **성공** | SSH Ubuntu 로그인, Nginx, curl 200 |
| **1-3** | SG 최소 인바운드, SSH 특정 IP | **확인** | TCP 22 /32, TCP 80 전체 |
| **1-4** | 외부 접속 A/B | **A 성공** | 외부 브라우저에서 nginx 환영 화면 |
| **1-5** | EC2/EBS/EIP/IGW/VPC 정리 완료 | **미완료** | 리소스 정리 후 갱신 |
| **2-1** | 외부→IGW→Subnet→EC2 흐름 설명 | **설명 자료 준비** | [architecture.md](architecture.md) |
| **2-2** | SG 허용·미허용 기준 설명 | **설명 자료 준비** | [evaluation-guide.md](evaluation-guide.md) |
| **2-3** | A/B 선택·구성 이유 | **A 실습 및 설명 준비** | Ubuntu/Nginx/HTTP 80/브라우저 |
| **2-4** | 태그·이름·체크리스트 관리 기준 | **부분 준비** | aws-mini-test 접두어 사용; 실제 태그 일치 여부 미확인 |
| **3-1** | `0.0.0.0/0 → IGW`의 필요성 | **답변 준비** | 기본 경로 의미 |
| **3-2** | SG vs IAM 최소 권한 | **답변 준비 / 실습 검증 필요** | IAM 권한 실제 구성 미확인, 콘솔에 root 표시됨 |
| **3-3** | SSH/DB 전체 공개 위험·대안 | **답변 준비** | SSH는 /32로 제한함 |
| **3-4** | 가설→검증과 로그 활용 | **사례 준비** | 서울 리전 접근 제한 진단 |
| **4-1** | 라우팅→SG→IP→프로세스 점검 순서 | **답변 준비** | [evaluation-guide.md](evaluation-guide.md) |
| **4-2** | IAM AccessDenied 시 최소 권한 찾기 | **답변 준비 / 미실습** | 권한 오류 실제 검증 안 함 |
| **4-3** | 2대 확장 시 병목과 ALB | **답변 준비 / 미실습** | ALB/Target Group/Health Check 설명 |
| **4-4** | 예상외 Billing 비용 분석 | **답변 준비 / 확인 대기** | Billing/잔여 리소스 검사 필요 |

> **'답변 준비'는 실제 구술 평가 통과를 뜻하지 않습니다.** 또한 원문 5쪽에는 루트 계정 사용 금지 및 별도 IAM 주체 사용 조건이 있으므로, 현재 스크린샷에서 `root`로 표시되는 부분은 제출 전에 검토해야 합니다.

## 4. 증빙 캡처 정리 (사용자 대화에 원본 존재, GitHub 업로드는 별도)

| 권장 파일명 | 캡처에 나타난 내용 |
|---|---|
| `docs/evidence/vpc-resource-map.png` | VPC→Public Subnet→Route Table→IGW 리소스 맵 |
| `docs/evidence/route-table.png` | local / IGW의 활성 라우트 및 서브넷 연결 |
| `docs/evidence/security-group.png` | 실제 SG SSH 22 /32, HTTP 80 /0 |
| `docs/evidence/ec2-running.png` | EC2 실행 중·퍼블릭 IPv4 |
| `docs/evidence/ssh-nginx.png` | SSH 터미널 및 curl 200 응답 |
| `docs/evidence/external-browser.png` | 주소창과 Welcome to nginx! |
| `docs/evidence/seoul-region-blocked.jpg` | 서울 리전 사용 불가 경고 |
| `docs/evidence/seoul-region-success.jpg` | 서울 리전 VPC 콘솔 진입 |

**보안:** 원본 캡처의 AWS 계정 ID, 로그인 이름, 브라우저 주소창의 식별자 등을 가리고 업로드해야 합니다. `.pem`, 액세스 키, 비밀값은 절대 Git에 올리지 않습니다.

## 5. 정리 순서 (아직 실행하지 않음)

1. 캡처를 로컬에 보관하고 필요한 것을 저장소에 업로드, 아키텍처 PNG/PDF 완성.
2. 해당 EC2 한 대만 `Terminate`하고 상태 증빙.
3. EC2 루트 EBS 자동 삭제 여부와 미사용 EBS/스냅샷 확인.
4. EC2 자동 퍼블릭 IP와 EIP를 구분하여, 할당된 EIP가 있다면 Release.
5. 해당 VPC의 IGW 및 종속 리소스를 확인해 삭제, VPC 삭제.
6. 같은 계정의 서울 리전 및 이전 시드니 리전에 비용 발생 리소스가 없는지, Billing이 남지 않았는지 확인 (Billing 반영 지연 가능).

**위 내용은 실행 계획입니다. 현재 삭제 완료로 표시하지 마세요.**
