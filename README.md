# 포켓몬고 레이드/출석부 제보봇
포켓몬고 도곡대치방 도리에 사용된 스크립트입니다.<br>
저는 해당 방에서 하입이라는 아이디를 사용한 유저구요.<br>
제 미천한 코드가 도움이 될지 모르겠으나, 편하게 가져가서 쓰세요.<br>
출처 남기지 않으셔도 됩니다. (원출처인 Dark Tornado님껀 남겨주세요)



# 기본적인 세팅
Dark Tornado 님의 카카오톡 봇을 사용했다가..최근 바꿨습니다

<br>[닼토님의 블로그](https://m.blog.naver.com/PostView.nhn?blogId=dt3141592&logNo=221213789127&proxyReferer=https%3A%2F%2Fwww.google.com%2F) / [닼토님의 깃헙](https://github.com/DarkTornado) / [닼토님의 카카오톡봇](https://play.google.com/store/apps/details?id=com.darktornado.kakaobot&hl=ko) / [메신저봇](https://play.google.com/store/apps/details?id=com.xfl.kakaotalkbot)
<br>1. 포켓몬고 하시는분들 대부분 2폰이실테니, 메인폰이 아닌 곳에 카톡봇을 돌리시면 됩니다.
<br>2. [메신저봇](https://play.google.com/store/apps/details?id=com.xfl.kakaotalkbot) 어플을 설치하시고 환경설정을 하시면 됩니다.
<br>3. 카카오톡봇 앱에서 카카오톡봇을 자바스크립트(javascript)로 생성합니다. (이름을 지어주세요. 간단하게 도리쓰시면 됩니다)
<br>4. 생성 후 폰을 컴퓨터에 연결하시면 katalkbot 폴더 내에 아까 생성한 봇 이름으로 .js파일이 있을 겁니다. 그 안에 이 깃헙에 있는 도리.js 파일을 넣어주세요 (덮어 써주세요).
<br>5. 폰에 컴퓨터를 연결하고 폰에 접속하자마자 있는 폴더에 DoriDB와 UniqueDB를 폴더째로 넣어주세요.
<br>6. 카카오톡봇 앱에 접속하여 시계방향으로 화살표 표시가 되어있는 버튼을 눌러 리로드를 해주세요
<br>7. 이러면 대충 가장 필요한 기능들 (제보와 팟은) 돌아갈겁니다. 안돌아가면 그때부터 코드를 좀 보셔야할텐데 굳럭입니다.

# 기본 명령어 모음
![명령어 그림](https://user-images.githubusercontent.com/24535854/61105750-d15bc900-a4b5-11e9-86d2-26720aa9919f.png)
<br><br><br>
# 레이드 제보, 팟, 리서치 관련 명령어 그림
## 레이드 제보, 현황 보기, 삭제, 변경, 리셋

<img src="https://user-images.githubusercontent.com/24535854/61105452-ed129f80-a4b4-11e9-99d3-d22fe9c8138b.jpg" width="400">
흠 되나
![레이드 제보](https://user-images.githubusercontent.com/24535854/61105452-ed129f80-a4b4-11e9-99d3-d22fe9c8138b.jpg){: width="400"}<br><br>
## 팟 생성, 삭제, 리셋
![팟 생성 현황](https://user-images.githubusercontent.com/24535854/61105450-ed129f80-a4b4-11e9-8e1d-76d119e0ed99.jpg){: width="400"}<br><br>
## 팟 명단추가, 명단제거, 내용변경
![팟 명단추가](https://user-images.githubusercontent.com/24535854/61105468-ef74f980-a4b4-11e9-8615-919c20aa3fd3.jpg){: width="400"}<br><br>
## 팟에 연타 추가하기
![연타 추가](https://user-images.githubusercontent.com/24535854/61105460-edab3600-a4b4-11e9-9f12-7cfb9a6eca99.jpg){: width="400"}<br><br>
## 팟에 메모하기
![팟 메모](https://user-images.githubusercontent.com/24535854/61105467-ef74f980-a4b4-11e9-82f7-e809c8cc3812.jpg){: width="400"}<br><br>
## 리서치 제보, 현황 보기, 삭제, 리셋
![리서치 제보 ](https://user-images.githubusercontent.com/24535854/61105457-edab3600-a4b4-11e9-86cf-23a691fdf1a3.jpg){: width="400"}<br><br>
## 전부 리셋
![전부 리셋](https://user-images.githubusercontent.com/24535854/61105463-eedc6300-a4b4-11e9-9fd8-9f75edd8152c.jpg){: width="400"}<br><br>
<br><br>
# 레이드 관련이 아닌 정보 명령어
## 포켓몬 도감 검색
![도감 검색](https://user-images.githubusercontent.com/24535854/61105451-ed129f80-a4b4-11e9-8c25-4df2fedd7a53.jpg){: width="400"}<br><br>
## EX나눔, 현황, 완료
![EX나눔](https://user-images.githubusercontent.com/24535854/61105434-dff5b080-a4b4-11e9-8829-6900eccf8a77.jpg){: width="400"}<br><br>
## 특정 타입 정보
![타입 및 버프](https://user-images.githubusercontent.com/24535854/61105465-eedc6300-a4b4-11e9-9c65-3dbfe9bbf8e2.jpg){: width="400"}<br><br>
## 리서치 검색
![리서치 검색](https://user-images.githubusercontent.com/24535854/61105455-ed129f80-a4b4-11e9-82e0-2353637cb121.jpg){: width="400"}<br><br>
## 이벤트, 커뮤데이 정보
![이벤트](https://user-images.githubusercontent.com/24535854/61105462-ee43cc80-a4b4-11e9-9b09-5655c4603529.jpg){: width="400"}<br><br>
## 방 관련 정보
![트레이너,뉴비인사](https://user-images.githubusercontent.com/24535854/61105466-eedc6300-a4b4-11e9-8adb-8513e9e4f469.jpg){: width="400"}<br><br>
## 사용방법
![출석부](https://user-images.githubusercontent.com/24535854/61105464-eedc6300-a4b4-11e9-96d9-11038f7d70eb.jpg){: width="400"}<br><br>
## 그 외 잡다 기능
![아무말](https://user-images.githubusercontent.com/24535854/61105459-edab3600-a4b4-11e9-9f68-a8f801e8862b.jpg){: width="400"}<br><br>


# 기본적인 업데이트 방법
리서치, 레이드 정보 등이 바뀜에 따라, 업데이트가 필요할겁니다.<br>
DoriDB 안에 텍스트파일의 이름을 보시고 대충 바꾸시면 될겁니다.<br>
ex1) 리서치를 바꿔야 한다 -> research____.txt<br>
ex2) 이벤트 정보를 업데이트 해야한다 -> event.txt<br>

# 내역
- 2018.09.03 봇 생성 (레이드 제보봇)<br>
- 2018.09.03 아무말 추가<br>
- 2018.10.02 레이드 팟 기능 추가<br>
- 2018.10.15 도감 추가<br>
- 2018.10.15 트레이너코드 추가<br>
- 2018.12.27 둥지 정보 추가<br>
- 2018.02.05 위치 크롤 시작<br>
- 그 외 버그들 추가<br>
- 2019.06.05 공개용 리포 생성<br>