//원작자 Dark Tornado님 - https://github.com/DarkTornado/KakaoTalkBot-Examples/blob/master/%EC%95%84%EC%9D%B4%EC%B9%B4.js
//진짜 개발새발로 쓴 코드니까, 읽으시는 모든 여러분 화이팅..
//닼토님 봇 어플을 사용할때 쓰는 코드입니다.

const sdcard = android.os.Environment.getExternalStorageDirectory().getAbsolutePath(); //내장메모리 최상위 경로

/*상수 (객체) 선언*/
const DoriDB = {}; const preChat = {}; const lastSender = {}; const botOn = {}; const basicDB = "basic";
const UniqueDB = {};
var currentTime = new Date(); var currentHour = currentTime.getHours(); var currentMinute = currentTime.getMinutes(); var todayDate = (currentTime.getMonth()+1) + "월 " + currentTime.getDate() + "일";

var roomNameForPrint = '도곡';

/*DoriDB 객체*/
DoriDB.createDir = function() { //배운 채팅들이 저장될 폴더를 만드는 함수
    var folder = new java.io.File(sdcard + "/Dori/"); //File 인스턴스 생성
    folder.mkdirs(); //폴더 생성
}; DoriDB.saveData = function(name, msg) { //파일에 내용을 저장하는 함수
    try {
        var file = new java.io.File(sdcard + "/Dori/" + name + ".txt");
        var fos = new java.io.FileOutputStream(file);
        var str = new java.lang.String(msg);
        fos.write(str.getBytes());
        fos.close();
    } catch (e) {
        Log.debug(e + ", " + e.lineNumber);
    }
}; DoriDB.readData = function(name) { //파일에 저장된 내용을 불러오는 함수
    try {
        var file = new java.io.File(sdcard + "/Dori/" + name + ".txt");
        if (!file.exists()) return null;
        var fis = new java.io.FileInputStream(file);
        var isr = new java.io.InputStreamReader(fis);
        var br = new java.io.BufferedReader(isr);
        var str = br.readLine();
        var line = "";
        while ((line = br.readLine()) != null) {
            str += "\n" + line;
        }
        fis.close();
        isr.close();
        br.close();
        return str;
    } catch (e) {
        Log.debug(e + ", " + e.lineNumber);
    }
};

UniqueDB.createDir = function() { //배운 채팅들이 저장될 폴더를 만드는 함수
    var folder = new java.io.File(sdcard + "/UniqueDB/"); //File 인스턴스 생성
    folder.mkdirs(); //폴더 생성
}; UniqueDB.saveData = function(name, msg) { //파일에 내용을 저장하는 함수
    try {
        var file = new java.io.File(sdcard + "/UniqueDB/" + name + ".txt");
        var fos = new java.io.FileOutputStream(file);
        var str = new java.lang.String(msg);
        fos.write(str.getBytes());
        fos.close();
    } catch (e) {
        Log.debug(e + ", " + e.lineNumber);
    }
}; UniqueDB.readData = function(name) { //파일에 저장된 내용을 불러오는 함수
    try {
        var file = new java.io.File(sdcard + "/UniqueDB/" + name + ".txt");
        if (!file.exists()) return null;
        var fis = new java.io.FileInputStream(file);
        var isr = new java.io.InputStreamReader(fis);
        var br = new java.io.BufferedReader(isr);
        var str = br.readLine();
        var line = "";
        while ((line = br.readLine()) != null) {
            str += "\n" + line;
        }
        fis.close();
        isr.close();
        br.close();
        return str;
    } catch (e) {
        Log.debug(e + ", " + e.lineNumber);
    }
};

/*Utils 객체 확장*/
Utils.getDustData = function(desiredLocation) { //전국 미세먼지 정보 가져오는 함수
    try {
        var data = Utils.getTextFromWeb("https://m.search.naver.com/search.naver?where=m&sm=mtb_etc&mra=blQ3&query=" + desiredLocation + "%20%EB%AF%B8%EC%84%B8%EB%A8%BC%EC%A7%80");        
        var dustData = data.split('<span class="text_top">미세먼지</span> <span class="number">')[1].split("</span>")[0];
        var fineDustData = data.split('<span class="text_top">초미세먼지</span> <span class="number">')[1].split("</span>")[0];
        return '미세먼지: ' + Utils.dustLevel(dustData) + '(' + dustData + 'μg/m³)\n초미세먼지: ' + Utils.dustLevel2(fineDustData) + '(' + fineDustData + 'μg/m³)\n';
            
    } catch (e) {
        Log.debug("미세먼지 정보 불러오기 실패\n오류: " + e + "\n위치: " + e.lineNumber);
        return "미세먼지 정보 불러오기 실패\n오류: " + e;
    }
}; 


function getWeathetInfo(pos) {
    try{
        var data = Utils.getWebText("https://m.search.naver.com/search.naver?query=" + pos + "%20날씨");  //검색 결과 파싱
        data = data.replace(/<[^>]+>/g,"");  //태그 삭제
        data = data.split("월간")[1];  //날씨 정보 시작 부분의 윗부분 삭제

        var rainMorning = data.split("주간날씨")[1].split('오전')[1].split('퍼센트')[0].trim();
        var rainEvening = data.split("주간날씨")[1].split('오후')[1].split('퍼센트')[0].trim();
        
        data = data.split("시간별 예보")[0];  //날씨 정보 끝 부분의 아래쪽 부분 삭제
        data = data.trim();  //위아래에 붙은 불필요한 공백 삭제
        data = data.split(' ').join('\n');
        
        data = data.replace(/\n\n/g,'\n');
        data = data.replace(/\n\n/g,'\n');
        data = data.split('\n'); 
        var results = [];
        results[0] = '현재 온도는 ' + data[1].split('온도')[1] + "℃,"
        results[1] = '체감 온도는 ' + data[2].split('온도')[1] + "℃에요!"; // 체감온도
        results[2] = ' ';
        results[3] = '오전 강수확률: ' + rainMorning + '%';
        results[4] = '오후 강수확률: ' + rainEvening + '%';
        results[5] = ' ';
        
        return results.join('\n')

    } catch(e) {
        return "날씨 정보 불러오기 실패\n오류: " + e;
    }
}



Utils.dustLevel = function(value) {
    //미세먼지용
    if (value <= 30) return "좋음";
    if (value < 80) return "보통";
    if (value < 120) return "나쁨";
    return "매우나쁨";
};
Utils.dustLevel2 = function(value) {
    //초미세먼지용
    if (value <= 15) return "좋음";
    if (value <= 35) return "보통";
    if (value <= 75) return "나쁨";
    return "매우나쁨";
};

Utils.getIniPayRate = function() { //도리야 인니페이 시세
    try {
        var data = Utils.getTextFromWeb("https://search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=5000%EB%A3%A8%ED%94%BC%EC%95%84");
        data = data.split('<span class="nb_txt _sub_price">')[2].split('원</span>')[0];
        data = data.trim();
        return "현재 100코인은 네이버 기준 " + data + "원 입니다.(좋아)";
    } catch (e) {
        //Log.debug("인니페이 시세 정보 불러오기 실패\n오류: " + e + "\n위치: " + e.lineNumber);
        return "인니페이 시세 정보 불러오기 실패\n오류: " + e;
    }
};

Utils.getTextFromWeb = function(url) {
    try {
        var url = new java.net.URL(url);
        var con = url.openConnection();
        if (con != null) {
            con.setConnectTimeout(5000);
            con.setUseCaches(false);
            var isr = new java.io.InputStreamReader(con.getInputStream());
            var br = new java.io.BufferedReader(isr);
            var str = br.readLine();
            var line = "";
            while ((line = br.readLine()) != null) {
                str += "\n" + line;
            }
            isr.close();
            br.close();
            con.disconnect();
        }
        return str.toString();
    } catch (e) {
        Log.debug(e);
    }
};

DoriDB.createDir(); //폴더 생성

function timeRenew(){
    currentTime = new Date(); currentHour = currentTime.getHours(); currentMinute = currentTime.getMinutes();
}//시간 갱신

function hasNumber(myString) {
  return /\d/.test(myString);
}//숫자 가지고 있는지 체크하는 함수

function sayItToHype (from, thisMessage){
    var messageStack = DoriDB.readData('toHype'); // 하입 목록 불러오기
    DoriDB.saveData('toHype',messageStack + '\n' + from + ' : ' + thisMessage);
}

// 포켓몬고 관련 정보 주는 함수 시작

//txt를 읽거나, 그 안에 있는 문장을 읽는 함수
function keyToText (textKey, dbName){
    var dbToUse = DoriDB.readData(dbName);
    if (textKey == null){
        return DoriDB.readData(dbName);
    } else {
        var keyNumber;
        var divideCategory = dbToUse.split("\n"); //첫 줄 빼기용
        var keySelect = divideCategory[0].split(",");
        if (divideCategory[0].includes(textKey)){
            keyNumber = keySelect.indexOf(textKey);
        } else {return "그런 단어는 제 사전에 없는 것 같아요!"}
        dbToUse = divideCategory[keyNumber];
        var divideTalk = dbToUse.split(","); //줄에서 쓸말을 각각 나눔
        var randTextNum = Math.floor((Math.random() * (divideTalk.length - 1)))+1;
        if (textKey == divideTalk[0]){
            return divideTalk[randTextNum]
        } else {return "something went wrong"}
    }
}

function simpleTalk (msg){
    var fileToUse = DoriDB.readData('simpleTalks').split('\n');
    for (var i = 0; i < fileToUse.length; i++){
        var initialLine = fileToUse[i].split(',');
        if (msg.includes(initialLine[0])){
            var randTextNum = Math.floor((Math.random() * (initialLine.length - 1)))+1;
            return initialLine[randTextNum];
        }
    }
    return 'none'
}

//포켓몬 정보 리턴 함수
function pokemonInfoReturn (pokemon){
    if (pokemon=='가라도스'){pokemon=='갸라도스';}
    if (pokemon=='레쿠자'){pokemon=='레쿠쟈';}
    if (pokemon.includes('기리티나')){pokemon = pokemon.replace('기리티나','기라티나');}
    if (pokemon.includes('왕쟈리')){pokemon = pokemon.replace('왕쟈리','왕자리');}
    //오타 계속 추가할 것
    var isItForm = 'NONE'
    if (pokemon.includes('알로라')){
        var dbToUse = DoriDB.readData("pokemonINFO_form");
        pokemon = pokemon.replace('알로라',''); pokemon = pokemon.replace('폼',''); pokemon = pokemon.trim();
        isItForm = '알로라';
    } else if (pokemon.includes('폼')){
        var dbToUse = DoriDB.readData("pokemonINFO_form");
        isItForm = pokemon.split(' ')[1]; isItForm = isItForm.replace('폼','');
        pokemon = pokemon.split(' ')[0];
    } else {
        var dbToUse = DoriDB.readData("pokemonINFO");
    }
    
    var keyNumber;
    var divideCategory = dbToUse.split("\n"); //첫 줄 빼기용
    var keySelect = divideCategory[0].split(",");
    if (divideCategory[0].includes(pokemon) && (isItForm == 'NONE')){
        keyNumber = keySelect.indexOf(pokemon);
    } else if (divideCategory[0].includes(pokemon) && (isItForm != 'NONE')) {
        for (var i = 1;i<keySelect.length+1;i++){
            if(keySelect[i].includes(pokemon) && keySelect[i].includes(isItForm)){
                keyNumber = i;
                break;
            }
        }
    } else if (Number.isInteger(parseInt(pokemon.replace('번','')))){
        keyNumber = parseInt(pokemon);
        pokemon = keySelect[keyNumber];
    } else {return 'none'}
    
    var pokedexInfo = divideCategory[keyNumber];
    var dividePokemonInfo = pokedexInfo.split(","); //줄에서 쓸말을 각각 나눔
//여기 아래부터 지정 시작
//pokedexNumber pokemonName type1 type2 attack defense stamina rank lv15 lv20 lv25 lv30 lv35 lv40 walkDistance catchRate escapeRate attack_FAST attack_CHARGE defense_FAST defense_CHARGE
    var pokedexNumber = dividePokemonInfo[0]; var pokemonName = dividePokemonInfo[1];
    var type1 = dividePokemonInfo[2]; var type2 = dividePokemonInfo[3];
    var attack = dividePokemonInfo[4]; var defense = dividePokemonInfo[5];
    var stamina = dividePokemonInfo[6];
    var rank = dividePokemonInfo[7];
    var lv15 = dividePokemonInfo[8]; var lv20 = dividePokemonInfo[9];
    var lv25 = dividePokemonInfo[10]; var lv30 = dividePokemonInfo[11];
    var lv35 = dividePokemonInfo[12]; var lv40 = dividePokemonInfo[13];
    var walkDistance = dividePokemonInfo[14]; var catchRate = dividePokemonInfo[15];
    var escapeRate = dividePokemonInfo[16]; 
    var attack_FAST = dividePokemonInfo[17]; var attack_FAST_DPS = dividePokemonInfo[18];
    var attack_CHARGE = dividePokemonInfo[19]; var attack_CHARGE_DPS = dividePokemonInfo[20];
    var defense_FAST = dividePokemonInfo[21]; var defense_FAST_DPS = dividePokemonInfo[22];
    var defense_CHARGE = dividePokemonInfo[23]; var defense_CHARGE_DPS = dividePokemonInfo[24];
    
    var counterType = dividePokemonInfo[25]; var counter1 = dividePokemonInfo[26];
    var counter2 = dividePokemonInfo[27]; var counter3 = dividePokemonInfo[28];
    
    
    if (type2 != 'NONE'){
        type1 = type1 + '/' + type2;
    }

    if (pokemonName.split('[')[0] == pokemon){
        var counterPart = '';
        if (counterType != null){
            counterPart = '\n\n카운터: ' + counterType + ' 타입\n1. ' + counter1 + '\n2. ' + counter2 + '\n3. ' + counter3;
        }
        
        return pokemonName + " (도감 #" + pokedexNumber + 
            ")\n타입 - " + type1 + 
            "\n공격 " + attack + " / 방어 " + defense + " / 체력 " + stamina + 
            "\n파트너 사탕거리 : " + walkDistance + 
            "\n포획률 : " + catchRate + " / 도주율 : " + escapeRate + 
            "\n\nCP (순위 #" + rank + 
            ")\nLV15 : " + lv15 + "    LV20 : " + lv20 + 
            "\nLV25 : " + lv25 + "    LV30 : " + lv30 + 
            "\nLV35 : " + lv35 + "    LV40 : " + lv40 + 
            "\n\n최고 스킬 조합(DPS):\n공격: " + 
            attack_FAST + "(" + attack_FAST_DPS + ") / " + attack_CHARGE + "(" + attack_CHARGE_DPS + 
            ")\n방어: " + defense_FAST + "(" + defense_FAST_DPS + ") / " + defense_CHARGE + "(" + defense_CHARGE_DPS + ")" + counterPart;
    } else {return 'none';}
}

//여기 아래부터 출석부 관련 함수

//출석부 생성
function createRoster(dbName, sender, rosterMSG, rosterMemoTemp){
    //생성한다 팟
    //dbname,'하입','3시 30분 작은분수 3시 45분 군인공제 3계정 팟 연타 생성'
    var prepList = rosterPrepare(rosterMSG);
    var isItConsecutive = prepList[0]; rosterMSG = prepList[1]; var numOfaccounts = prepList[2]-1; //리턴값 나눈기
    var roster = UniqueDB.readData(dbName); // 출석부 목록 불러오기
    if (isItConsecutive == true){
        //여기서 연타를 만들어버리자
        var theDividedConsecList = rosterDivideConsecutive(rosterMSG);
        var firstOne = theDividedConsecList[0]; var secondOne = theDividedConsecList[1];
        if (numOfaccounts>0){
            var senderAc = sender + ' +' + numOfaccounts;
        } else {var senderAc = sender;}
        var initialRoster = firstOne[2] + 'aCombo!!' + ',' + firstOne[0] + "," + firstOne[1] + "," + firstOne[2] + "," + rosterMemoTemp + "," + senderAc;
        var secondRoster = firstOne[2] + 'aCombo!!' + ',' + secondOne[0] + "," + secondOne[1] + "," + secondOne[2] + "," + senderAc;
        
        if ((roster + ' ').includes(',')){
            roster = roster + '\n' + initialRoster + '\n' + secondRoster;
        } else {
            roster = initialRoster + '\n' + secondRoster;
        }
        UniqueDB.saveData(dbName, roster); //출석부 저장
        return readThisRoster([[initialRoster],[secondRoster]]);
    } else {
        //여긴 연타가 아닌 것
        var timeList = rosterTimeSet(rosterMSG);
        if (numOfaccounts>0){
            var senderAc = sender + ' +' + numOfaccounts;
        } else {var senderAc = sender;}
        
        var initialRoster = sender + ',' + timeList[0] + "," + timeList[1] + "," + timeList[2] + "," + rosterMemoTemp + "," + senderAc;
        if ((roster + ' ').includes(',')){
            //팟 이름 중복체크
            var overlapCheck = UniqueDB.readData(dbName).split('\n');
            for (var x = 0;x<overlapCheck.length;x++){
                var theOverlapCheckInitialList = overlapCheck[x].split(',');
                if (theOverlapCheckInitialList[3] == timeList[2]){
                    initialRoster = sender + ',' + timeList[0] + "," + timeList[1] + "," + timeList[2] + " 후발대," + rosterMemoTemp + "," + senderAc;
                }
            }
            roster = roster + '\n' + initialRoster;
        } else {
            roster = initialRoster;
        }
        UniqueDB.saveData(dbName, roster); //출석부 저장
        return readThisRoster([initialRoster]);
    }
}

//출석부 준비함수
function rosterPrepare (rosterMSG){
    //[연타 여부, 메세지, 계정 수]를 반환한다
    //3시 30분 작은분수 3계정 -> [false,'3시 30분 작은분수,3]
    //3시 30분 작은분수 3시 45분 우성정문 3계정 연타생성 -> [true,'3시 30분 작은분수 3시 45분 우성정문,3]
    //발러 미스틱 계정 처리 등
    var mysticNum=0; var valorNum=0; var instiNum=0; var etcNum=0;
    rosterMSG = rosterMSG.replace('팟','');
    rosterMSG = rosterMSG.replace('출석부',''); rosterMSG = rosterMSG.replace('생성',''); 
    rosterMSG = rosterMSG.replace('참석',''); rosterMSG = rosterMSG.replace('참여',''); rosterMSG = rosterMSG.replace('참가',''); rosterMSG = rosterMSG.replace('인스토피아','욜로토피아');
    var isItConsecutive = false;
    
    if (rosterMSG.includes('연타')){
        rosterMSG = rosterMSG.replace('연타','');
        isItConsecutive = true;
    }
    
    if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('미')+1]))  && parseInt(rosterMSG[rosterMSG.indexOf('미')+1]) > 0){
        rosterMSG = rosterMSG.replace('미','미스틱')
    }
    if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('발')+1]))  && parseInt(rosterMSG[rosterMSG.indexOf('발')+1]) > 0){
        rosterMSG = rosterMSG.replace('발','발러')
    }
    if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('인')+1]))  && parseInt(rosterMSG[rosterMSG.indexOf('인')+1]) > 0){
        rosterMSG = rosterMSG.replace('인','인스')
    }
    
    var numOfaccounts = 0;
    if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('계정')-1]))  && parseInt(rosterMSG[rosterMSG.indexOf('계정')-1]) > 0){
            numOfaccounts = rosterMSG[rosterMSG.indexOf('계정')-1];
            rosterMSG = rosterMSG.replace(numOfaccounts + '계정','');
    } else if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('계정')-1]))  && parseInt(rosterMSG[rosterMSG.indexOf('계정')-1]) == 0){
            numOfaccounts = parseInt(rosterMSG[rosterMSG.indexOf('계정')-2]);
            numOfaccounts = numOfaccounts + parseInt(rosterMSG[rosterMSG.indexOf('계정')-1]);
            rosterMSG = rosterMSG.replace(numOfaccounts + '계정','');
    } else if (Number.isInteger(parseInt(rosterMSG[rosterMSG.indexOf('게정')-1]))  && parseInt(rosterMSG[rosterMSG.indexOf('게정')-1]) > 0){
            numOfaccounts = rosterMSG[rosterMSG.indexOf('게정')-1];
            rosterMSG = rosterMSG.replace(numOfaccounts + '게정','');
    }
    numOfaccounts = parseInt(numOfaccounts)

    rosterMSG = rosterMSG.replace('인스팅트','인스');
    rosterMSG = rosterMSG.replace('미스틱 ','미스틱'); rosterMSG = rosterMSG.replace('발러 ','발러');
    rosterMSG = rosterMSG.replace('인스 ','인스');
    rosterMSG = rosterMSG.trim();
    
    if (rosterMSG.includes("미스틱")){
        mysticNum = parseInt(rosterMSG.split('미스틱')[1].split(' ')[0]);
        rosterMSG = rosterMSG.slice(0,rosterMSG.indexOf('미스틱')) + rosterMSG.slice(rosterMSG.indexOf('미스틱')+4);
    }
    if (rosterMSG.includes("발러")){
        valorNum = parseInt(rosterMSG.split('발러')[1].split(' ')[0]);
        rosterMSG = rosterMSG.slice(0,rosterMSG.indexOf('발러')) + rosterMSG.slice(rosterMSG.indexOf('발러')+3);
    }
    if (rosterMSG.includes("인스")){
        instiNum = parseInt(rosterMSG.split('인스')[1].split(' ')[0]);
        rosterMSG = rosterMSG.slice(0,rosterMSG.indexOf('인스')) + rosterMSG.slice(rosterMSG.indexOf('인스')+3);
    }
    rosterMSG = rosterMSG.trim();
    
    numOfaccounts = numOfaccounts + mysticNum + valorNum + instiNum;
    
    rosterMSG = rosterMSG.replace('욜로토피아','인스토피아');

    //여기 지우면 됨
    if (rosterMSG.includes('시계') || rosterMSG.includes('전시') || rosterMSG.includes('시즌') || rosterMSG.includes('나시') || rosterMSG.includes('시타') || rosterMSG.includes('유크시')){
        var tempContent = rosterMSG.split(' ');
        for (var i=0;i<tempContent.length;i++){
            if (tempContent[i].includes('전시') || tempContent[i].includes('시계') || tempContent[i].includes('시즌') || tempContent[i].includes('나시') || tempContent[i].includes('시타') || tempContent[i].includes('유크시')){
                var tempVal = tempContent[i];
                tempContent.splice(i,1);
                tempContent.splice(50,0,tempVal);
                rosterMSG = tempContent.join(' ');

                break;
            }
        }
    }
    
    return [isItConsecutive,rosterMSG,numOfaccounts]
}

//출석부 시간 계산 함수
function rosterTimeSet (rosterMSG){
    //3시 30분 작은분수 내용을 받아서 -> [3,30,작은분수]를 리턴
    //[시작시,시작분,레이드내용]을 반환한다
    var timeDivide = rosterMSG.split(' ');
    var startHR; var startMIN; var raidContent = rosterMSG;
    
    
    var swapIt = rosterMSG.split(' ');
    if (!(swapIt[0].includes('1시') || swapIt[0].includes('2시') || swapIt[0].includes('3시') || swapIt[0].includes('4시') || swapIt[0].includes('5시') || swapIt[0].includes('6시') || swapIt[0].includes('7시') || swapIt[0].includes('8시') || swapIt[0].includes('9시') || swapIt[0].includes('10시') || swapIt[0].includes('11시') || swapIt[0].includes('12시'))){//좀 멍청하긴한데, 그냥 이렇게 하자 ㅎㅎ;
        var tempIt = swapIt[swapIt.length-1];
        swapIt[swapIt.length-1] = swapIt[0];
        swapIt[0] = tempIt;
        
        if (swapIt[0].includes('1분') || swapIt[0].includes('2분') || swapIt[0].includes('3분') || swapIt[0].includes('4분') || swapIt[0].includes('5분') || swapIt[0].includes('6분') || swapIt[0].includes('7분') || swapIt[0].includes('8분') || swapIt[0].includes('9분') || swapIt[0].includes('0분')){
            var tempIt = swapIt[1];
            swapIt[1] = swapIt[0];
            swapIt[0] = tempIt;
        }

        rosterMSG = swapIt.join(' ');
        timeDivide = rosterMSG.split(' ');
        raidContent = rosterMSG;
    }
    
    for (var i = 0; i < timeDivide.length; i++){ //시작 시와 분 구하기
        if (timeDivide[i].includes(':')){ //11:50
            startHR = timeDivide[i].split(':')[0]; startMIN = timeDivide[i].split(':')[1];
            raidContent = raidContent.replace(timeDivide[i],"");
            if (startMIN == '08'){
                startMIN = '8';
            } else if (startMIN == '09'){
                startMIN = '9'
            } break;
        } else if (timeDivide[i].includes('시') && timeDivide[i].includes('분')){ //11시50분
            startHR = timeDivide[i].split('시')[0]; startMIN = timeDivide[i].split('시')[1].split('분')[0];
            raidContent = raidContent.replace(timeDivide[i],""); break;
        } else if (timeDivide[i].includes('시')){
            startHR = timeDivide[i].split('시')[0];
            raidContent = raidContent.replace(timeDivide[i].split('시')[0],"");
            raidContent = raidContent.replace("시","");
            if (Number.isInteger(parseInt(timeDivide[i].split('시')[1]))){ //11시50
                startMIN = timeDivide[i].split('시')[1]; break;
            } else if (timeDivide[i+1].includes('분') && (Number.isInteger(parseInt(timeDivide[i+1].split('분')[0].trim())))){ //11시 50분
                raidContent = raidContent.replace(timeDivide[i+1],"");
                startMIN = timeDivide[i+1].split('분')[0]; break;
            } else if(timeDivide[i+1].includes('08분')){
                raidContent = raidContent.replace(timeDivide[i+1],"");
                startMIN = '8'; break;
            } else if(timeDivide[i+1].includes('09분')){
                raidContent = raidContent.replace(timeDivide[i+1],"");
                startMIN = '9'; break;
            } else { //11시
                startMIN = '0'; break;
            }
            raidContent = raidContent.replace(timeDivide[i],"");
        }
    }    
    startHR = startHR.trim(); startMIN = startMIN.trim(); 

    if (startMIN == NaN){
        if(timeDivide[i].split(':')[1] == '08'){
            startMIN = 8;
        } else if (timeDivide[i].split(':')[1] == '09'){
            startMIN = 9;
        }
    }
    raidContent = raidContent.trim();
    if (parseInt(startMIN) < 10){
        startMIN = '0' + parseInt(startMIN);
    }
    return [startHR,startMIN,raidContent];
}

//출석부 - 명령어에 연타가 있으면 연타로 나누는 함수
function rosterDivideConsecutive (rosterMSG){
    //3시 30분 작은분수 3시 45분 군인공제 -> [ [ '3', '30', '어쩌구 저쩌구' ], [ '3', '45', '우성정문' ] ] 
    //위와 같이 연타일 때 분할해서 리턴
    //*오류날수 있다ㅎㅎ
    var theFirstOne = rosterTimeSet(rosterMSG);
    var firstContent = theFirstOne[2].split(' ');
    var secondInput;
    for (var i = 1; i < firstContent.length;i++){
        if(firstContent[i].includes(':')){
            theFirstOne[2] = firstContent.slice(0,i).join(' '); secondInput = firstContent.slice(i).join(' ');
            break;
        } else if (firstContent[i].includes('시')){
            theFirstOne[2] = firstContent.slice(0,i).join(' '); secondInput = firstContent.slice(i).join(' ');
            break;
        }
    }
    
    var theSecondOne = rosterTimeSet(secondInput);
    
    return [theFirstOne,theSecondOne];    
}

//출석부 읽어주는 최종 함수 (카톡에서 보는 방식)
function readThisRoster (rosterList){
    //[하입,4,00,김밥나라,하입 +2]
    //[[작은분수aCombo!!,3,30,작은분수,하입 +2], [작은분수aCombo!!,3,45,군인공제,하입 +2]]
    //이걸 카톡에서 보는 방식으로 프린트함
    var accountCount = 0;
    if (rosterList.length>1){
        //2개 이상 (연타로 만드는 팟 출력)
        var memberList = '';
        var rosterToUse = (rosterList[0] + '').split(',');
        var printable = rosterToUse[3] + ' ' + '연타\n[1] ' + rosterToUse[1] + ':' + rosterToUse[2] + ' ' + rosterToUse[3];
        var memoIs = rosterToUse[4];
        memberList = rosterToUse.slice(5);
        for (var i = 1;i<rosterList.length;i++){
            rosterToUse = (rosterList[i] + '').split(',');
            printable = printable + '\n[' + (i+1) + '] ' + rosterToUse[1] + ':' + rosterToUse[2] + ' ' + rosterToUse[3];
            memberList = memberList + ',' + rosterToUse.slice(5);
        }
        
        memberList = memberList.split(',').reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);
        //중복값 제거
        
        for (var i = 0; i < memberList.length; i++){
            var theMemberName = memberList[i];
            var stNum = 0;
            var endNum = 0;
            for (var j = 0; j < rosterList.length; j++){
                //시작 찾기
                var theLine = rosterList[j] + '';    
                if (theLine.includes(theMemberName)){
                    if (stNum == 0){
                        stNum = j+1;
                    }
                    break;
                }
            }
            
            for (var j; j < rosterList.length; j++){
                // 끝나기 찾기
                var theLine = rosterList[j] + '';    
                if (!theLine.includes(theMemberName)){
                    endNum = j; break;
                }
            }
            if (endNum==0){
                endNum = j;
            }
            //여기부터 후처리
            if (stNum==endNum){
                memberList[i] = memberList[i] + ' (' + endNum + '번만)';
            } else if (endNum==rosterList.length){
                true;
            } else if (endNum-stNum ==1){
                memberList[i] = memberList[i] + ' (' + stNum + ',' + endNum + '번만)';
            } else {
                memberList[i] = memberList[i] + ' (' + stNum + '~' + endNum + '번)';
            }
        }
        for (var j = 0;j<memberList.length;j++){
            printable = printable + '\n' + (j+1) + '. ' + memberList[j];
            if (memberList[j].includes('+')){
                var theAccN = parseInt(memberList[j].split('+')[1]);
                accountCount = accountCount + theAccN;
            }
            accountCount++;
        }
        if (accountCount==0){
            accountCount = 1;
        }
        
        if (!memoIs.includes('TEMPTEMPTEMPTEMPTEMP')){
            printable = printable + '\n--------------------\n' + memoIs;
            if (accountCount > 10){
                printable = printable + '\n' + accountCount + '계정';
            }
        } else if (accountCount > 10){
            printable = printable + '\n--------------------\n' + accountCount + '계정';
        }

        return(printable);
    } else {
        //팟 1개짜리 출력
        for (var i = 0;i<rosterList.length;i++){
            var rosterToUse = (rosterList[i] + '').split(',');
            var printable = rosterToUse[1] + ':' + rosterToUse[2] + ' ' + rosterToUse[3];
            
            
            for (var j = 5;j<rosterToUse.length;j++){
                printable = printable + '\n' + (j-4) + '. ' + rosterToUse[j];
                if (rosterToUse[j].includes('+')){
                    var theAccN = parseInt(rosterToUse[j].split('+')[1]);
                    accountCount = accountCount + theAccN;
                }
                accountCount++;
            }
            
        }
        if (accountCount==0){
            accountCount = 1;
        }
        
        var memoIs = rosterToUse[4];
        
        if (!memoIs.includes('TEMPTEMPTEMPTEMPTEMP')){
            printable = printable + '\n--------------------\n' + memoIs;
            if (accountCount > 10){
                printable = printable + '\n' + accountCount + '계정';
            }
        } else if (accountCount > 10){
            printable = printable + '\n--------------------\n' + accountCount + '계정';
        }
                
        return printable;
    }
}

//모든 곳에서 printRoster로 들어와서 -> readThisRoster로 넘어간다
function printRoster (roster,replier){
    //전체를 읽는 것
    //연타가 있으면 연타로 합쳐서 프린트
    //아니면 그냥 프린트
    if ((roster + ' ').includes('aCombo!!')){
        roster = roster + '\nTHE_END_END,FOR_REAL';
    }
    if (!(roster + ' ').includes('\n')){
        replier.reply(readThisRoster([roster])); return true;
    } else {
        rosterList = roster.split('\n');
    }
    var didItPrint = false; var itpassedHere = false; var checkUntilDNE = 'initial';
    for (var i = 0; i < rosterList.length; i++){
        var initialList = rosterList[i].split(',')
        if (initialList[0].includes('aCombo!!') && initialList[0]!=checkUntilDNE){
            //연타가 있다면
            var stackIt = [];
            checkUntilDNE = initialList[0];
            itpassedHere = false;
            didItPrint = false;
            
            for (var j = i; j<rosterList.length; j++){
                var checkList = rosterList[j].split(',');
                if (checkList[0] != checkUntilDNE){
                    i = j-1;
                    if (stackIt.length!=0){
                        replier.reply(readThisRoster(stackIt));
                    }
                    didItPrint = true;
                    break;
                } else {
                    if (!(checkList[0].includes('THE_END_END'))){
                        stackIt.push(checkList);
                    }
                }
            }
        } else {
            if (!(initialList[0].includes('THE_END_END'))){
                itpassedHere = true;
                replier.reply(readThisRoster([initialList]));
            }
        }
    }
    if (didItPrint == false && itpassedHere == false){
        replier.reply(readThisRoster(roster.split('\n')));
    }
    //return rosterList;
}

//기존 팟 혹은 연타에 연타를 추가하는 팟
function addConsecRoster (dbName, sender, rosterMSG, replier){
    //작은분수 연타추가 2시 20분 우성정문
    //2가지 상태가 있다
    // 1. 기존 팟에서 추가할떄 (앞이 combo가 아님)
    // 2. 연타에서 추가할때 (앞이 combo 임)
    //김밥천국aCombo!!,8,15,마지막파티,하입,기기기기,가이오가,일구일구
    rosterMSG = rosterMSG.replace('연타 추가','연타추가');
    rosterMSG = rosterMSG.replace('연타추가 :','연타추가:');
    rosterMSG = rosterMSG.replace('연타추가:','연타추가');
    var theOriginalRosterName = rosterMSG.split('연타추가')[0]; theOriginalRosterName = theOriginalRosterName.trim();
    var rosterToAdd = rosterMSG.split('연타추가')[1]; rosterToAdd = rosterToAdd.trim();
    
    rosterToAdd = rosterPrepare(rosterToAdd);
    
    var rosterAllDone = rosterTimeSet(rosterToAdd[1])
    
    //rosterToAdd를 그대로 넣으면 된다.
    //roster 불러오기
    roster = UniqueDB.readData(dbName);
    
    var rosterList = roster.split('\n');
    var theComboName = 'sender';
    for (var i = 0; i < rosterList.length; i++){
        var initialList = rosterList[i];
        if (initialList.includes(theOriginalRosterName)){
            theComboName = initialList.split(',')[0];
            theOriginalRosterName = initialList.split(',')[3];
            var findSenderList = initialList.split(',');
            for (var k = 5; k < findSenderList.length; k++){
                if (findSenderList[k].includes(sender)){
                    sender = findSenderList[k];
                    break;
                }
            }
            break;
        }
    }
    
    var finalRosterToAdd = '';
    
    if (theComboName.includes('aCombo!!')){
        //연타라서 변경할 것이 없다. 그냥 저장하고 말면 알아서 다 읽는다
        finalRosterToAdd = theComboName + ',' + rosterAllDone[0] + ',' + rosterAllDone[1] + ',' + rosterAllDone[2] + 'TEMPTEMPTEMPTEMPTEMP' + "," + ',' + sender;
        rosterList.push(finalRosterToAdd);
    } else {
        finalRosterToAdd = theOriginalRosterName + 'aCombo!!,' + rosterAllDone[0] + ',' + rosterAllDone[1] + ',' + rosterAllDone[2] + ',' + 'TEMPTEMPTEMPTEMPTEMP' + "," + sender;
        var theOriginalRoster = theOriginalRosterName + 'aCombo!!,' + findSenderList[1] + ',' + findSenderList[2] + ',' + findSenderList[3] + ',' + findSenderList[4] + ',' + sender;
        rosterList[i] = theOriginalRoster;
        rosterList.push(finalRosterToAdd);
        theComboName = theOriginalRosterName + 'aCombo!!';
    }
    roster = rosterList.join('\n');
    UniqueDB.saveData(dbName,roster);
    
    changeRosterTime(dbName,rosterAllDone[0] + '시 ' + rosterAllDone[1] + '분 ' + rosterAllDone[2],replier);
    return;
    //작은분수 시간변경: 5:30 / 작은분수 시간변경: 5시 30분
    /*
    rosterList = roster.split('\n');
    var getConsecList = [];
    for (var k = 0; k < rosterList.length; k++){
        initialRoster = rosterList[k].split(',');
        if (initialRoster[0] == theComboName){
            getConsecList.push(initialRoster);
        }
    }        
    return(readThisRoster(getConsecList));*/
}

//출석부 시간 변경
function changeRosterTime (dbName, rosterMSG, replier){
    //작은분수 시간변경: 5:30 / 작은분수 시간변경: 5시 30분
    rosterMSG = rosterMSG.replace("변경 :",""); rosterMSG = rosterMSG.replace("변경:",""); rosterMSG = rosterMSG.replace("변경","");
    rosterMSG = rosterMSG.replace("시간",""); rosterMSG = rosterMSG.replace("  "," ");
    var roster = UniqueDB.readData(dbName); // 출석부 목록 불러오기
    var changeSet = rosterTimeSet(rosterMSG); var checkConsec = false;
    if (roster.includes(changeSet[2])){
        var rosterList = roster.split('\n');
        for (var i = 0; i < rosterList.length; i++){
            var thisRosterList = rosterList[i].split(',');
            if (thisRosterList[3].includes(changeSet[2])){
                thisRosterList[1] = changeSet[0]; thisRosterList[2] = changeSet[1];
                rosterList[i] = thisRosterList.join(',');
                roster = rosterList.join('\n');
                if (thisRosterList[0].includes('aCombo!!')){
                    checkConsec = true;
                    var getComboName = thisRosterList[0];
                }
                break;
            }
        }
    }
    if (checkConsec==true){
        //연타라면, 시간이 변경되었을때 해당 시간에 맞게 연타가 재정렬되어야 한다
        //roster 정의 가져옴
        var rosterList = roster.split('\n');
        var rosterListDel = roster.split('\n');
        var dummyRosterList = [];
        for (var i = 0; i < rosterList.length; i++){
            if (rosterList[i].includes(getComboName)){
                dummyRosterList.push(rosterList[i]);
                rosterListDel.splice(rosterListDel.indexOf(rosterList[i]),1);
            }
        }        
        dummyRosterList.sort();
        
        roster = dummyRosterList.join('\n') + '\n' + rosterListDel.join('\n');
    }
    UniqueDB.saveData(dbName, roster); //출석부 저장

    
    if (checkConsec==true){

        rosterList = roster.split('\n');
        var getConsecList = [];
        for (var k = 0; k < rosterList.length; k++){
            initialRoster = rosterList[k].split(',');
            if (initialRoster[0] == getComboName){
                getConsecList.push(initialRoster);
            }
        }        
        replier.reply(readThisRoster(getConsecList)); return;
    } else {
        //replier.reply(thisRosterList);
        replier.reply(readThisRoster([rosterList[i]])); return;
    }
    


}

//출석부 내용 변경
function changeRosterContent (dbName, rosterMSG, replier){
    //711 4성 내용변경: 711 마기라스
    rosterMSG = rosterMSG.replace('변경:','변경'); rosterMSG = rosterMSG.replace('내용 변경','내용변경'); 
    rosterMSG = rosterMSG.replace('변경 :','변경');
    rosterMSG = rosterMSG.trim();
    var raidContent = rosterMSG.split('내용변경')[1].trim();
    var previousContent = rosterMSG.split('내용변경')[0].trim();
    var roster = UniqueDB.readData(dbName); // 출석부 목록 불러오기
    var divideRoster = roster.split('\n');
    var checkConsec = false; var getComboName = '';
    var i = 0;
    for (i = 0; i < divideRoster.length; i++){
        if (divideRoster[i].includes(previousContent)){
            var contentChangedRoster = divideRoster[i].split(',');
            contentChangedRoster[3] = raidContent;
            if (contentChangedRoster[0].includes('aCombo!!')){
                checkConsec = true; getComboName = contentChangedRoster[0];
            }
            contentChangedRoster = contentChangedRoster.join(',');
            divideRoster.splice(i,1,contentChangedRoster);

            roster = divideRoster.join('\n');
            UniqueDB.saveData(dbName, roster); //출석부 저장
            break;
        }
    }
    
    if (checkConsec==true){

        var rosterList = roster.split('\n');
        var getConsecList = [];
        for (var k = 0; k < rosterList.length; k++){
            var initialRoster = rosterList[k].split(',');
            if (initialRoster[0] == getComboName){
                getConsecList.push(initialRoster);
            }
        }        
        replier.reply(readThisRoster(getConsecList)); return;        
    } else {
        replier.reply(readThisRoster([contentChangedRoster])); return;
    }
}

//출석부 삭제
function deleteRoster (dbName, rosterMSG){
    // 작은분수 팟 펑
    // 작은분수 팟 펑합니다
    rosterMSG = rosterMSG.replace('합니다',''); rosterMSG = rosterMSG.replace('팟 펑','');
    var deleteWholeConsec = false;
    if (rosterMSG.includes('연타')){
        rosterMSG = rosterMSG.replace('연타',''); deleteWholeConsec = true;
    }
    
    var raidContent = rosterMSG.trim();
    var roster = UniqueDB.readData(dbName) + '\n'; // 출석부 목록 불러오기
    var divideRoster = roster.split('\n');
    var getconsecName = '';
    
    
    
    for (var i = 0; i < divideRoster.length; i++){
        if (divideRoster[i].includes(raidContent)){
            var initialRoster = divideRoster[i].split(',');
            if (initialRoster[0].includes('aCombo!!') && deleteWholeConsec==true){
                getconsecName = initialRoster[0];
                var delRosterList = roster.split('\n');
                for (var k = 0; k < divideRoster.length; k++){
                    var initialRoster2 = divideRoster[k].split(',');
                    if (initialRoster2[0] == getconsecName){
                        delRosterList.splice(i,1);
                    }
                }
                divideRoster = delRosterList;
            } else {
                divideRoster.splice(i,1);
            }
            roster = divideRoster.join('\n');
            if (roster==null){
                roster = '';
            }
            
            UniqueDB.saveData(dbName, roster); //출석부 저장
            return raidContent + " 팟이 취소되었습니다.";
            break;
        }
    }
    return "헉 " + raidContent + " 팟 취소안됨;;";


}

//출석부 리셋
function rosterReset (dbName){ //출석부 리셋
    UniqueDB.saveData(dbName,''); return '모든 출석부가 삭제되었습니다.';
}

//출석부 참석
function participateRoster (dbName, rosterMSG, sender, replier){
    //팟 참석
    //연타 참석
    var roster = UniqueDB.readData(dbName); // 출석부 목록 불러오기
    var consecName = ''; var getConsecList = [];
    rosterMSG = rosterPrepare(rosterMSG);
    var itIsConsec = rosterMSG[0];
    if (rosterMSG[2] > 1){
        sender = sender + ' +' + (rosterMSG[2]-1);
    }
    
    if (rosterMSG[0]==false){
        //그냥 팟 참석임
        //roster 불러오기
        var rosterList = (roster+'\n').split('\n');        
        for (var i = 0;i < rosterList.length; i++){
            var initialRoster = rosterList[i].split(',');
            if (initialRoster[3].includes(rosterMSG[1])){
                initialRoster.push(sender);
                rosterList[i] = initialRoster.join(',')
                roster = rosterList.join('\n');
                UniqueDB.saveData(dbName, roster); //출석부 저장
                
                if (initialRoster[0].includes('aCombo!!')){
                    theComboName = initialRoster[0];
                    rosterList = roster.split('\n');
                    for (var k = 0; k < rosterList.length; k++){
                        initialRoster = rosterList[k].split(',');
                        if (initialRoster[0] == theComboName){
                            getConsecList.push(initialRoster);
                        }
                    }
                    replier.reply(readThisRoster(getConsecList)); return;
                }
                replier.reply(readThisRoster([initialRoster])); return true;                
            }
        }
    } else { // 연타 참석
        var howManyRosters = rosterMSG[1];
        if (hasNumber(howManyRosters[howManyRosters.indexOf('번')-1])){
            if (hasNumber(howManyRosters[howManyRosters.indexOf('번만')-1])){
                //1번만 혹은 하나만 참석
                var getRosterNumber = howManyRosters[howManyRosters.indexOf('번만')-1];
                var getRosterName = howManyRosters.replace(howManyRosters[howManyRosters.indexOf('번만')-1] + '번만','');
                
                getRosterName = getRosterName.replace('참석',''); getRosterName = getRosterName.replace('연타',''); getRosterName = getRosterName.trim();
                
                var getComboName = '';
                var rosterList = roster.split('\n');
                for (var i = 0; rosterList.length; i++){
                    //콤보 이름 구하는 것
                    var initialRoster = rosterList[i];
                    if (initialRoster.includes(getRosterName)){
                        getComboName = initialRoster.split(',')[0];
                        break;
                    }
                }
                
                var getNumberOfRoster = 0;
                var getActualRostersName = 'noInputYet';
                for (var i = 0; rosterList.length; i++){
                    //연타 번호 구하는 것
                    var initialRoster = rosterList[i];
                    if (initialRoster.includes(getComboName)){
                        getNumberOfRoster++;
                    }
                    if (getNumberOfRoster == getRosterNumber){
                        getActualRostersName = initialRoster.split(',')[3];
                        break;
                    }
                }
                if (getActualRostersName != 'noInputYet'){
                    participateRoster(dbName, getActualRostersName, sender, replier)
                }
                
                
            }
            
            
            //1번만
            //1~2번, 1~4, 1 2 3 4 참석
            
            
        } else {
            //전체 참석
        
            var rosterList = roster.split('\n');
            var foundTheRoster = false; var theComboName = '';
            for (var i = 0;i < rosterList.length; i++){
                var initialRoster = rosterList[i].split(',');
                if (foundTheRoster != false){
                    if (initialRoster[0] == theComboName){
                        initialRoster.push(sender);
                        rosterList[i] = initialRoster.join(',');
                        roster = rosterList.join('\n'); 
                    }
                } else if (initialRoster[3].includes(rosterMSG[1])){
                    initialRoster.push(sender);
                    foundTheRoster = true;
                    theComboName = initialRoster[0];
                    rosterList[i] = initialRoster.join(',');
                }
            }
            roster = rosterList.join('\n');
            UniqueDB.saveData(dbName, roster); //출석부 저장
            
            
            rosterList = roster.split('\n');
            for (var k = 0; k < rosterList.length; k++){
                initialRoster = rosterList[k].split(',');
                if (initialRoster[0] == theComboName){
                    getConsecList.push(initialRoster);
                }
            }
            replier.reply(readThisRoster(getConsecList)); return;
        }
    }
    //return rosterMSG;
}

//출석부 명단추가
function addPersonToRoster (dbName, rosterMSG, replier){
    rosterMSG = rosterMSG.replace('명단 추가','명단추가'); rosterMSG = rosterMSG.replace('명단추가 :','명단추가:');
    rosterMSG = rosterMSG.replace('명단추가:','명단추가'); rosterMSG = rosterMSG.replace('명단추가','');
    rosterMSG = rosterMSG.replace('  ',' ');
    //rosterMSG = rosterMSG.split('명단추가');
    rosterMSG = rosterPrepare(rosterMSG);
    
    if (rosterMSG[1].includes('  ')){
        rosterMSG[1] = rosterMSG[1].replace('  ',' '); rosterMSG[1] = rosterMSG[1].replace('  ',' ');
    }
    
    var sender1 = rosterMSG[1].split(' ')[1];
    if (rosterMSG[2]!=0){
        rosterMSG[1] = rosterMSG[1].split(' ')[0] + ' ' + rosterMSG[2] + '계정';
    } else {
        rosterMSG[1] = rosterMSG[1].split(' ')[0];
    }
    if (rosterMSG[0]==true){
        rosterMSG[1] = rosterMSG[1] + ' 연타';
    }
    participateRoster(dbName, rosterMSG[1],sender1,replier);
}

//출석부 명단 제거
function delPersonFromRoster (dbName, rosterMSG, replier){
    rosterMSG = rosterMSG.replace('명단 제거','명단제거'); rosterMSG = rosterMSG.replace('명단제거 :','명단제거:');
    rosterMSG = rosterMSG.replace('명단제거:','명단제거'); rosterMSG = rosterMSG.replace('명단제거','');
    rosterMSG = rosterMSG.replace('  ',' ');
    //rosterMSG = rosterMSG.split('명단추가');
    rosterMSG = rosterPrepare(rosterMSG);
    var sender1 = rosterMSG[1].split(' ')[1];  
    getOutFromRoster(dbName, sender1, rosterMSG[1], replier);
}

//출석부에서 빠지는 함수
function getOutFromRoster (dbName, sender, rosterMSG, replier){
    // 작은분수 빠질게
    // 작은분수 빠지겠습니다
    rosterMSG = rosterMSG.replace('팟','');
    rosterMSG = rosterMSG.replace('빠지겠습니다',''); rosterMSG = rosterMSG.replace('빠질게',''); rosterMSG.trim();
    rosterMSG = rosterMSG.replace('  ',' '); rosterMSG = rosterMSG.replace('  ',' ');
    var roster = UniqueDB.readData(dbName); // 출석부 목록 불러오기
    var itIsConsec = false; var consecName = ''; var getConsecList = [];
    if (rosterMSG.includes('연타')){
        //연타 전체를 빠지기
        rosterMSG.replace('연타',''); itIsConsec = true;
        rosterMSG = rosterMSG.split(' ')[0].trim();
        var divideRoster = roster.split('\n');
        var i = 0
        
        
        for (i = 0; i < divideRoster.length; i++){
            if (divideRoster[i].includes(rosterMSG) && divideRoster[i].includes('aCombo!!')){
                var dummyRoster = divideRoster[i].split(',');
                consecName = dummyRoster[0];
            }
        }
        
        for (i = 0; i < divideRoster.length; i++){
            if (divideRoster[i].includes(consecName)){
                var initialRoster = divideRoster[i].split(',');
                var reWriteRoster = initialRoster[0] + ',' + initialRoster[1] + ',' + initialRoster[2] + ',' + initialRoster[3];
                for (var j = 4; j < initialRoster.length; j++){
                    if (!initialRoster[j].includes(sender)){
                        reWriteRoster = reWriteRoster + ',' + initialRoster[j];
                    }
                }
                divideRoster.splice(i,1,reWriteRoster);
                roster = divideRoster.join('\n');
                UniqueDB.saveData(dbName, roster); //출석부 저장
                
                //추가 된 부분
            }
        }
        divideRoster = roster.split('\n');
        for (var k = 0; k < divideRoster.length; k++){
            initialRoster = divideRoster[k].split(',');
            if (initialRoster[0] == consecName){
                getConsecList.push(initialRoster);
            }
        }
        replier.reply(readThisRoster(getConsecList)); return;
        //printRoster(roster);
    } else {
        rosterMSG = rosterMSG.split(' ')[0].trim();
        var divideRoster = roster.split('\n');
        var i = 0
        for (i = 0; i < divideRoster.length; i++){
            if (divideRoster[i].includes(rosterMSG)){
                var initialRoster = divideRoster[i].split(',');
                //아래 1줄 추가
                consecName = initialRoster[0];
                var reWriteRoster = initialRoster[0] + ',' + initialRoster[1] + ',' + initialRoster[2] + ',' + initialRoster[3];
                for (var j = 4; j < initialRoster.length; j++){
                    if (!initialRoster[j].includes(sender)){
                        reWriteRoster = reWriteRoster + ',' + initialRoster[j];
                    }
                }
                divideRoster.splice(i,1,reWriteRoster);
                roster = divideRoster.join('\n')
                UniqueDB.saveData(dbName, roster); //출석부 저장
                
                //아래 추가
                divideRoster = roster.split('\n'); getConsecList = [];
                for (var k = 0; k < divideRoster.length; k++){
                    initialRoster = divideRoster[k].split(',');
                    if (initialRoster[0] == consecName){
                        getConsecList.push(initialRoster);
                    }
                }
                replier.reply(readThisRoster(getConsecList)); return;
            }
        }
        return 'none';
    }
}

//출석부 시간 지나면 삭제
function checkTime(dbName){
    // 시간이 지난 출석부를 삭제하는 함수
    // 이름,시간,분,어쩌구 <-처음 3개만 체크하면된다
    // 저장을 24 기준으로 안했음ㅋ 망함
    
    //시간 지나면 자동 삭제 하기
    
    
    
    var listInTwelve = ('\n' + UniqueDB.readData(dbName)).split('\n'); listInTwelve.shift();
    //다시 짜야돼!@@@@@@@@@@
    for (var i = 0; i < listInTwelve.length; i++){
        if (listInTwelve[i].split(',')[0].includes('aCombo!!')){
            true;
        } else {
            
        
            var tempEndHR = parseInt(listInTwelve[i].split(',')[1]);
            var tempEndMIN = listInTwelve[i].split(',')[2];

            //시간 지나면 자동 삭제 하기
            currentTime = new Date();
            if (currentTime.getHours() > 11){ //1시 이후일때 -> 존재하는 팟은 무조건 12시 이후 팟 
                if (tempEndHR < 11){ //오후 11시 이전 팟들에 한해서
                    tempEndHR = tempEndHR + 12;
                }
            }
            
            var compareTime = 0;
            if (currentTime.getMinutes() < 10){
                compareTime = parseInt(currentTime.getHours() + '' + ('0'+currentTime.getMinutes()));
            } else {
                compareTime = parseInt(currentTime.getHours() + '' + currentTime.getMinutes());
            }
            
            var endTime = parseInt(tempEndHR + tempEndMIN);
            
            if (endTime < compareTime-3){
                deleteRoster(dbName,listInTwelve[i].split(',')[3] + ' 팟 펑');
            }
            
            
            
        }
    }
    
    //replier.reply(listInTwelve);
    //UniqueDB.saveData(dbName,listInTwelve.join('\n'));
}

//출석부 메모


//출석부 관련 함수 끝

//아래는 레이드 관련 함수

//시간 관련 함수
/*
function timeSet (dbName,raidContent){
    if (hasNumber(raidContent)){
        var listToUse = UniqueDB.readData(dbName);
        raidContent = raidContent.replace("제보",""); raidContent = raidContent.trim();
        var startHR; var startMIN='0'; var endHR; var endMIN; 

        //제보 7:28 전시홀

        if (raidContent.includes('시계') || raidContent.includes('전시') || raidContent.includes('나시') || raidContent.includes('시즌') || raidContent.includes('시타')){
            var tempContent = raidContent.split(' ');
            for (var i=0;i<tempContent.length;i++){
                if (tempContent[i].includes('전시') || tempContent[i].includes('시계') || tempContent[i].includes('시즌') || tempContent[i].includes('나시') || tempContent[i].includes('시타')){
                    var tempVal = tempContent[i];
                    tempContent.splice(i,1);
                    tempContent.splice(50,0,tempVal);
                    raidContent = tempContent.join(' ');
                    
                    break;
                }
            }
        }
        
        while (raidContent.includes('  ')){
            raidContent = raidContent.replace('  ',' ');
        }

        var timeDivide = raidContent.split(' ');


        for (var i = 0; i < timeDivide.length; i++){ //시작 시와 분 구하기
            if (timeDivide[i].includes(':')){ //11:50
                startHR = timeDivide[i].split(':')[0]; startMIN = timeDivide[i].split(':')[1];
                if (startMIN == '08'){
                    startMIN = '8';
                } else if (startMIN == '09'){
                    startMIN = '9'
                }
                raidContent = raidContent.replace(timeDivide[i],""); break;
            } else if (timeDivide[i].includes('시') && timeDivide[i].includes('분')){ //11시50분
                startHR = timeDivide[i].split('시')[0];
                startMIN = timeDivide[i].split('시')[1].split('분')[0];
                raidContent = raidContent.replace(timeDivide[i],""); break;
            } else if (timeDivide[i].includes('시')){
                startHR = timeDivide[i].split('시')[0];
                raidContent = raidContent.replace(timeDivide[i].split('시')[0],"");
                raidContent = raidContent.replace("시","");
                if (Number.isInteger(parseInt(timeDivide[i].split('시')[1]))){ //11시50
                    startMIN = timeDivide[i].split('시')[1]; break;
                } else if (timeDivide[i+1].includes('분') && (Number.isInteger(parseInt(timeDivide[i+1].split('분')[0].trim())))){ //11시 50분
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = timeDivide[i+1].split('분')[0]; break;
                } else if(timeDivide[i+1].includes('08분')){
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = '8'; break;
                } else if(timeDivide[i+1].includes('09분')){
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = '9'; break;
                } else { //11시
                    startMIN = '0'; break;
                }
                raidContent = raidContent.replace(timeDivide[i],"");
            }
        }
        
        while (raidContent.includes('  ')){
            raidContent = raidContent.replace('  ',' ');
        }
        
        startHR = startHR.trim();
        startMIN = startMIN.trim();
        raidContent = raidContent.trim();
        startHR = parseInt(startHR); 
        startMIN = parseInt(startMIN);
        if (startMIN == NaN){
            if(timeDivide[i].split(':')[1] == '08'){
                startMIN = 8;
            } else if (timeDivide[i].split(':')[1] == '09'){
                startMIN = 9;
            }
        }
        if (currentTime.getHours() > 10 && startHR < 10){
            startHR = startHR + 12;
        }
        if (startMIN < 15){ //끝나는 시, 분 구하기
            endHR = startHR;
            endMIN = startMIN + 45;
        } else {
            endHR = startHR + 1;
            endMIN = startMIN - 15;
        }
        if (startMIN < 10){
            startMIN = "0" + startMIN;
        }
        if (endMIN < 10){
            endMIN = "0" + endMIN;
        }

        var reportedTime = parseInt(endHR + '' + endMIN);
        var timeSort = listToUse.split('\n');
        var compareTime; var reportIndex = 100;
        for (var i = 1; i < timeSort.length; i++){
            compareTime = parseInt(timeSort[i].split(',')[2] + timeSort[i].split(',')[3]);
            if (reportedTime <= compareTime){ // RT가 11시, CT가 12시면
                reportIndex = i; break;
            }
        }
        
        
        
        for (var i = 1; i < timeSort.length; i++){
            var initialRaidContent = raidContent.replace('5성','').trim();
            if (timeSort[i].includes(initialRaidContent)){
                return '지금은 안들어오겠지';
                return listToUse;
            }
        }
        
        if (reportIndex == 100){ // 안돌았으니 제일 늦은시간대인거임
            listToUse = listToUse + "\n" + startHR + "," + startMIN + "," + endHR + "," + endMIN + "," + raidContent;
        } else { //아니면 해당 시간에 넣기
            return '여기에 들어가야하는데 안들어오는거야?\n 이제까지 쌓인 것\n\n' + listToUse;
            timeSort.splice(i,0,startHR + "," + startMIN + "," + endHR + "," + endMIN + "," + raidContent);
            listToUse = timeSort.join('\n');
        }
        return listToUse;
    } else {
        var listToUse = UniqueDB.readData(dbName);
        return listToUse;
    }
}
*/

function timeSet (dbName,raidContent){
    if (hasNumber(raidContent)){
        var listToUse = UniqueDB.readData(dbName);
        raidContent = raidContent.replace("제보",""); raidContent = raidContent.trim();
        var startHR; var startMIN='0'; var endHR; var endMIN; 

        //제보 7:28 전시홀
        raidContent = raidContent.replace('유크시','전설포켓몬유크어쩌구');
        
        

        if (raidContent.includes('시계') || raidContent.includes('전시') || raidContent.includes('시즌') || raidContent.includes('나시') || raidContent.includes('시타') || raidContent.includes('유크시')){
            var tempContent = raidContent.split(' ');
            for (var i=0;i<tempContent.length;i++){
                if (tempContent[i].includes('전시') || tempContent[i].includes('시계') || tempContent[i].includes('시즌') || tempContent[i].includes('나시') || tempContent[i].includes('시타') || tempContent[i].includes('유크시')){
                    var tempVal = tempContent[i];
                    tempContent.splice(i,1);
                    tempContent.splice(50,0,tempVal);
                    raidContent = tempContent.join(' ');
                    
                    break;
                }
            }
        }
        var timeDivide = raidContent.split(' ');


        for (var i = 0; i < timeDivide.length; i++){ //시작 시와 분 구하기
            if (timeDivide[i].includes(':')){ //11:50
                startHR = timeDivide[i].split(':')[0]; startMIN = timeDivide[i].split(':')[1];
                if (startMIN == '08'){
                    startMIN = '8';
                } else if (startMIN == '09'){
                    startMIN = '9'
                }
                raidContent = raidContent.replace(timeDivide[i],""); break;
            } else if (timeDivide[i].includes('시') && timeDivide[i].includes('분')){ //11시50분
                startHR = timeDivide[i].split('시')[0];
                startMIN = timeDivide[i].split('시')[1].split('분')[0];
                raidContent = raidContent.replace(timeDivide[i],""); break;
            } else if (timeDivide[i].includes('시')){
                startHR = timeDivide[i].split('시')[0];
                raidContent = raidContent.replace(timeDivide[i].split('시')[0],"");
                raidContent = raidContent.replace("시","");
                if (Number.isInteger(parseInt(timeDivide[i].split('시')[1]))){ //11시50
                    startMIN = timeDivide[i].split('시')[1]; break;
                } else if (timeDivide[i+1].includes('분') && (Number.isInteger(parseInt(timeDivide[i+1].split('분')[0].trim())))){ //11시 50분
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = timeDivide[i+1].split('분')[0]; break;
                } else if(timeDivide[i+1].includes('08분')){
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = '8'; break;
                } else if(timeDivide[i+1].includes('09분')){
                    raidContent = raidContent.replace(timeDivide[i+1],"");
                    startMIN = '9'; break;
                } else { //11시
                    startMIN = '0'; break;
                }
                raidContent = raidContent.replace(timeDivide[i],"");
            }
        }
        
        raidContent = raidContent.replace('전설포켓몬유크어쩌구','유크시');
        
        startHR = startHR.trim();
        startMIN = startMIN.trim();
        raidContent = raidContent.trim();
        startHR = parseInt(startHR); 
        startMIN = parseInt(startMIN);
        if (startMIN == NaN){
            if(timeDivide[i].split(':')[1] == '08'){
                startMIN = 8;
            } else if (timeDivide[i].split(':')[1] == '09'){
                startMIN = 9;
            }
        }
        if (currentTime.getHours() > 10 && startHR < 10){
            startHR = startHR + 12;
        }
        if (startMIN < 15){ //끝나는 시, 분 구하기
            endHR = startHR;
            endMIN = startMIN + 45;
        } else {
            endHR = startHR + 1;
            endMIN = startMIN - 15;
        }
        if (startMIN < 10){
            startMIN = "0" + startMIN;
        }
        if (endMIN < 10){
            endMIN = "0" + endMIN;
        }

        var reportedTime = parseInt(endHR + '' + endMIN);
        var timeSort = listToUse.split('\n');
        var compareTime; var reportIndex = 100;
        for (var i = 1; i < timeSort.length; i++){
            compareTime = parseInt(timeSort[i].split(',')[2] + timeSort[i].split(',')[3]);
            if (reportedTime <= compareTime){ // RT가 11시, CT가 12시면
                reportIndex = i; break;
            }
        }
        
        
        for (var k = 1; k < timeSort.length; k++){
            var initialRaidContent = raidContent.replace('5성','').trim();
            if (timeSort[k].includes(initialRaidContent)){
                return listToUse;
            }
        }
        
        if (reportIndex == 100){ // 안돌았으니 제일 늦은시간대인거임
            listToUse = listToUse + "\n" + startHR + "," + startMIN + "," + endHR + "," + endMIN + "," + raidContent;
        } else { //아니면 해당 시간에 넣기
            timeSort.splice(i,0,startHR + "," + startMIN + "," + endHR + "," + endMIN + "," + raidContent);
            listToUse = timeSort.join('\n');
        }
        return listToUse;
    } else {
        var listToUse = UniqueDB.readData(dbName);
        return listToUse;
    }
}


//잔여 제보 함수 (작은분수 기라티나 20분 남음)
function raidRemainingConvert (msg){
    //작은분수 기라티나 20분 남음 -> 2시 55분 작은분수 기라티나 제보 로 변경
    //제보는 일단 지우고 시작
    msg = msg.replace('제보',''); msg = msg.replace('남음','제보');
    msg = msg.replace('유크시','전설포켓몬유크어쩌구');
    while(msg.includes('  ')){
        msg = msg.replace('  ',' ');
    }
    var msgList = msg.split(' ');
    var theMinute = '';
    for (var i = 0; i < msgList.length; i++){
        var initialMsgBlock = msgList[i];
        if (hasNumber(initialMsgBlock[initialMsgBlock.indexOf('분')-1])){
            theMinute = initialMsgBlock.split('분')[0];
            break;
        }
    }
    
    //이제 분 구함. 시를 구하자
    var timeNow = new Date();
    var minuteNow = timeNow.getMinutes() - (45-theMinute);
    var hourNow = timeNow.getHours();
    
    if (minuteNow < 0){
        //시간 변경되어야됨
        hourNow = hourNow - 1;
        minuteNow = minuteNow + 60;
    }
        
        //3시 5분에 30분 남은것
        //원래 2시 50분 부화임
    
    msgList[i] = hourNow + '시 ' + minuteNow + '분';
    
    return msgList.join(' ')
}


//여기 체크. 제보 변경 함수
function raidReportChange(dbName, changeReport){
    var currentReport = UniqueDB.readData(dbName); // 현재 방의 리서치 목록
    var previousReport = changeReport.split('제보')[0].trim();
    var toBeReport = changeReport.split('변경')[1].trim(); toBeReport = toBeReport.replace(":","").trim();
    var currentReportDivide = currentReport.split('\n');
    for (var i = 1; i < currentReportDivide.length; i++){
        if (currentReportDivide[i].includes(previousReport)){
            var writeNewReport = currentReportDivide[i].split(',');
            writeNewReport[4] = toBeReport;
            writeNewReport = writeNewReport.join(',');
            currentReportDivide.splice(i,1,writeNewReport);
            
            currentReport = currentReportDivide.join('\n');
            UniqueDB.saveData(dbName,currentReport);
            return printReport(dbName,UniqueDB.readData(dbName));
            break;
        }
    }
    return "제보 변경 안됐는데?"
}

//레이드 정보 삭제 하는 함수
function deleteThisReport (dbName,toDel){
    var listToDeleteFrom = UniqueDB.readData(dbName); var pickDelLine; var delList = listToDeleteFrom.split("\n");
    toDel = toDel.trim();
    for (var i = 0; i < delList.length; i++){
        if (delList[i].includes(toDel)){
            delList.splice(i,1); break;
            
        }
    }
    listToDeleteFrom = '레이드 목록';
    
    for (var i = 1; i < delList.length; i++){
        listToDeleteFrom = listToDeleteFrom + '\n' + delList[i];
    }
    UniqueDB.saveData(dbName, listToDeleteFrom); //제보 등록
    return listToDeleteFrom;
}

//레이드 정보 프린트하는 함수 (레이드 정보 최종은 여기서 끝난다)
function printReport (dbName,raidList){
    var listInTwelve = raidList.split('\n');
    //listInTwelve = 3,30,4,15,작은분수
    var listForSending = '레이드 제보'
    
    for (var i = 1; i < listInTwelve.length; i++){
        var tempStartHR = parseInt(listInTwelve[i].split(',')[0]);
        var tempStartMIN = listInTwelve[i].split(',')[1];
        var tempEndHR = parseInt(listInTwelve[i].split(',')[2]);
        var tempEndMIN = listInTwelve[i].split(',')[3];
        
        if (tempStartMIN == '08'){
            tempStartMIN = 8;
        } else if (tempStartMIN == '09'){
            tempStartMIN = 9;
        }
        if (tempEndMIN == '08'){
            tempEndMIN = 8;
        } else if (tempEndMIN == '09'){
            tempEndMIN = 9;
        }
        
        tempStartMIN = parseInt(tempStartMIN);
        tempEndMIN = parseInt(tempEndMIN);
        
        //시간 지나면 자동 삭제 하기
        currentTime = new Date();
        if ((currentTime.getHours() > tempEndHR) || ((currentTime.getHours() == tempEndHR) && currentTime.getMinutes() > tempEndMIN)){ // 시간이 더 크거나, 시간이 같지만 분이 더 클떄
            deleteThisReport(dbName,listInTwelve[i].split(',')[4]);
        } else {
            if (tempStartHR > 12){
                tempStartHR = tempStartHR - 12;
            }
            if (tempEndHR > 12){
                tempEndHR = tempEndHR - 12;
            }
            if (tempStartMIN < 10){
                tempStartMIN = '0' + tempStartMIN;
            }
            if (tempEndMIN < 10){
                tempEndMIN = '0' + tempEndMIN;
            }
            
            listForSending = listForSending + '\n' + tempStartHR + ':' + tempStartMIN + '~' + tempEndHR + ':' + tempEndMIN + ' ' + listInTwelve[i].split(',')[4];
            
        }
    }
    
    return listForSending;
    
    //여기부터 지역을 나눠보자
    //여긴 신경 안쓰셔도 됩니다.
    //만약 지역별로 프린트하고싶으시면 작업하시는 부분입니다
    if (listForSending.includes('\n')){
        var msgList = listForSending.split('\n');

        var gangnamList = '[강남/논현/신논현]';
        var yangjeList = '[양재/포이]';
        var sinsaList = '[신사/압구정/학동]';
        var samsungList = '[역삼/선릉/삼성]';
        var dogokList = '[도곡/대치/한티]';
        var gaepoList = '[개포/대청]';
        var eonjuList = '[언주/선정릉]';
        var ilwonList = '[일원/수서]'
        var etcList = '[미분류]';

        var excludeThese = '기라티나,라티아스,라티오스,라티,기라,망나뇽,마기라스,테오키스,마기,기라,괴력몬,알로라 나시,알로라 텅구리,알로라 라이츄,알텅,텅구리,라이츄,5성,4성,3성,2성,1성,후딘,팬텀,앱솔,토게틱,유크시,아그놈,엠라이트,엠라,앰라이트,앰라';

        var initialRaidName = '';
        var textDivideList = UniqueDB.readData('locationCategory').split('\n');
        var theLocationIs = '';
        var excludeList = excludeThese.split(',');
        
        for (var i = 1;i < msgList.length;i++){
            initialRaidName = msgList[i].split(' ');
            initialRaidName.shift(); initialRaidName = initialRaidName.join(' ');
            
            
            for (var k = 0;k < excludeList.length;k++){        
                if (initialRaidName.includes(excludeList[k])){
                    initialRaidName = initialRaidName.replace(excludeList[k],'');
                    initialRaidName = initialRaidName.replace('  ',' '); initialRaidName = initialRaidName.trim(); break;
                }
            }

            theLocationIs = '그 외 미분류';
            var initialNameWithoutSpaces = initialRaidName;
            
            //스페이스바 없애기
            while (initialNameWithoutSpaces.includes(' ')){
                initialNameWithoutSpaces = initialNameWithoutSpaces.replace(' ','');
            }
            //대문자 없애기
            initialNameWithoutSpaces = initialNameWithoutSpaces.toLowerCase();
            

            
            for (var j = 0;j < textDivideList.length;j++){
                //locationCategory로부터 지역을 분류
                //이 바로 아래는 예외사항을 넣는 곳
                if (initialNameWithoutSpaces.length == 0){
                    break;
                }
                
                //삼성과 대치 중복 제보
                if (initialNameWithoutSpaces.includes('신화코리아') || initialNameWithoutSpaces.includes('대치6') || initialNameWithoutSpaces.includes('푸르지오') || initialNameWithoutSpaces.includes('군산횟집') || initialNameWithoutSpaces.includes('강남중앙교회') || initialNameWithoutSpaces.includes('신화코리아') || initialNameWithoutSpaces.includes('신화코리아') || initialNameWithoutSpaces.includes('신화코리아')){
                    samsungList = samsungList + '\n' + msgList[i];
                    //dogokList = dogokList + '\n' + msgList[i];
                    theLocationIs = '역삼/선릉/삼성'; break;
                }
                
                
                
                if (textDivideList[j].includes(initialNameWithoutSpaces)){
                    theLocationIs = textDivideList[j].split(',')[0];
                    if (theLocationIs === '도곡/한티/대치'){
                        dogokList = dogokList + '\n' + msgList[i];
                    } else if (theLocationIs === '개포/대청'){
                        gaepoList = gaepoList + '\n' + msgList[i];
                    } else if (theLocationIs === '역삼/선릉/삼성'){
                        samsungList = samsungList + '\n' + msgList[i];
                    } else if (theLocationIs === '양재/포이'){
                        yangjeList = yangjeList + '\n' + msgList[i];
                    } else if (theLocationIs === '강남/논현/신논현'){
                        gangnamList = gangnamList + '\n' + msgList[i];
                    } else if (theLocationIs === '신사/압구정'){
                        sinsaList = sinsaList + '\n' + msgList[i];
                    } else if (theLocationIs === '언주/선정릉'){
                        eonjuList = eonjuList + '\n' + msgList[i];
                    } else if (theLocationIs === '일원/수서'){
                        ilwonList = ilwonList + '\n' + msgList[i];
                    }
                    
                    //신사/압구정
                    break;
                }
            }
            if (theLocationIs=='그 외 미분류' && initialNameWithoutSpaces.length > 0) {
                etcList = etcList + '\n' + msgList[i];
            }
        }

        //해당 지역에 레이드 제보가 없으면, 더하지 않는다
        
        //구역따라 프린트하는게 다르다
        
        var finalPrint = '레이드 제보';
        
        if (roomNameForPrint.includes('도곡')){
            //도곡은 양재/도곡/삼성/개포/그외
            if (dogokList.includes('\n')){
                finalPrint = dogokList + '\n';
            }
            if (yangjeList.includes('\n')){
                finalPrint = finalPrint + '\n' + yangjeList + '\n';
            }
            if (gaepoList.includes('\n')){
                finalPrint = finalPrint + '\n' + gaepoList + '\n';
            }
            if (etcList.includes('\n')){
                finalPrint = finalPrint + '\n' + etcList + '\n';
            }            
        } else if (roomNameForPrint.includes('삼성')){
            if (samsungList.includes('\n')){
                finalPrint = samsungList + '\n';
            }
            if (etcList.includes('\n')){
                finalPrint = finalPrint + '\n' + etcList + '\n';
            } 
        } else if (roomNameForPrint.includes('압구정')){
            if (sinsaList.includes('\n')){
                finalPrint = sinsaList + '\n';
            }
            if (gangnamList.includes('\n')){
                finalPrint = finalPrint + '\n' + gangnamList + '\n';
            }
            if (eonjuList.includes('\n')){
                finalPrint = finalPrint + '\n' + eonjuList + '\n';
            }
            if (etcList.includes('\n')){
                finalPrint = finalPrint + '\n' + etcList + '\n';
            } 
        } else {
            if (gangnamList.includes('\n')){
                finalPrint = finalPrint + '\n' + gangnamList + '\n';
            }
            if (yangjeList.includes('\n')){
                finalPrint = finalPrint + '\n' + yangjeList + '\n';
            }
            if (sinsaList.includes('\n')){
                finalPrint = finalPrint + '\n' + sinsaList + '\n';
            }
            if (samsungList.includes('\n')){
                finalPrint = finalPrint + '\n' + samsungList + '\n';
            }
            if (dogokList.includes('\n')){
                finalPrint = finalPrint + '\n' + dogokList + '\n';
            }
            if (gaepoList.includes('\n')){
                finalPrint = finalPrint + '\n' + gaepoList + '\n';
            }
            if (eonjuList.includes('\n')){
                finalPrint = finalPrint + '\n' + eonjuList + '\n';
            }
            if (ilwonList.includes('\n')){
                finalPrint = finalPrint + '\n' + ilwonList + '\n';
            }
            if (etcList.includes('\n')){
                finalPrint = finalPrint + '\n' + etcList + '\n';
            }
        }
        return finalPrint.substring(0, finalPrint.length-1);
    } else {
        return '현재 제보가 없습니다';
    }
}

//레이드하고 리서치 목록 돌려주는 함수 (나도 왜 내가 이렇게 짰는지 몰라. //아악 이거 벌써 바꿔야지 하고 반년지났네)
function raidReportReturn (dbName, newReport, delReport){
    var nonReport = 1; if (dbName.includes("raidStatus")){nonReport = 0;}
    
    if (newReport != null) {
        if (hasNumber(newReport)){
            UniqueDB.saveData(dbName,timeSet(dbName,newReport));
            //return timeSet(dbName,newReport);
            return printReport(dbName,UniqueDB.readData(dbName));
        } else {
            return '';
        }
    }
    if (delReport == "DELETE ALL"){
        if (nonReport==0){
            UniqueDB.saveData(dbName,"레이드 제보"); //제보 리셋
        } else {
            UniqueDB.saveData(dbName, "리서치 목록"); //제보 리셋
        }
        return "제보가 리셋되었습니다.";
    } else if(delReport != null){
       deleteThisReport(dbName,delReport);
    }
    if (nonReport == 0){
        return printReport(dbName,UniqueDB.readData(dbName));
    } else {
        return UniqueDB.readData(dbName);
    }
}

//리서치 관련 함수
function researchReturn (dbName, newReport){
    var currentReport = UniqueDB.readData(dbName); // 현재 방의 리서치 목록
    var researchInfo = DoriDB.readData('researchDivide'); // 리서치 찾을 사전
    var researchInput = newReport.split(' ')[newReport.split(' ').length-1] + ''; // 마지막 단어. 보통 미뇽
    var researchInput2 = newReport.split(' ')[newReport.split(' ').length-2] + ''; // 마지막에서 두번째 단어. 보통 장소
    var researchFind = researchInfo.split('\n');
    var researchPokemonName = researchFind[0].split(',');
    var researchToPut = ''; var researchTitle = '';
    var researchMission = '';
    for (var i = 0; i < researchFind.length; i++){
        if (researchFind[i].includes(researchInput)){
            researchToPut = "▶ " + newReport.replace(researchInput, ''); researchTitle = researchFind[i].split(',')[0] + "";
            researchMission = researchFind[i].split(',')[1] + ""; break;
        } else if(researchFind[i].includes(researchInput2)){
            researchToPut = "▶ " + newReport.replace(researchInput2, ''); researchTitle = researchFind[i].split(',')[0] + "";
            researchMission = researchFind[i].split(',')[1] + ""; break;
        }
    } // 리서치를 사전에서 찾는 것
    var researchMonth = new Date().getMonth()+1;
    var researchDate = new Date().getDate();
    var researchBreakDown = currentReport.split('\n'); // 현재 리포트를 나눠서 뽑음
    researchTitle = researchTitle.trim(); researchToPut = researchToPut.trim();
    
    //if (researchTitle == '고오스' || researchTitle == '아노딥스'){
    //researchTitle = researchTitle + ' ';}
    if (currentReport.includes(researchTitle)){
        for (var i = 0; i < researchBreakDown.length; i++){
            if (researchBreakDown[i].includes(researchTitle)){
                /*
                if ((researchTitle == '고오스' || researchTitle == '아노딥스') && researchBreakDown[i].includes('릴링')){
                    true; // 고오스처럼 리서치 두개 (그레이트 3회, 스탑방문 2회) 있는거 있을때 이거 해제
                } else {*/
                researchBreakDown.splice(i+1,0,researchToPut);
                currentReport = "📚리서치 목록 [" + researchMonth + '/' + researchDate + ']';
                break;
                //}
            }
        }
    } else {
        researchBreakDown = researchBreakDown.concat(['[' + researchTitle.trim() + '] ' + researchMission,researchToPut]);
        currentReport = "📚리서치 목록 [" + researchMonth + '/' + researchDate + ']';
    }
    // 리서치 끼워넣기
    for (var i = 1; i < researchBreakDown.length; i++){
        if (researchBreakDown[i].includes('[') && i > 2 && researchBreakDown[i-1]!=''){
            currentReport = currentReport + "\n\n" + researchBreakDown[i];
        } else {
            currentReport = currentReport + "\n" + researchBreakDown[i];
        }
        
    } // 리서치 저장 할 준비
    currentReport = currentReport.replace('\n\n\n','\n');
    UniqueDB.saveData(dbName, currentReport); //리서치 저장
    return currentReport;
}

//리서치 삭제 함수
function deleteResearch (dbName, delReport){
    delReport = delReport.replace('오보',''); delReport = delReport.replace('해줘','').trim(); delReport = delReport.replace('삭제','').trim(); delReport = delReport.replace('리서치','').trim();
    var currentReport = UniqueDB.readData(dbName); // 현재 방의 리서치 목록
    var researchInList = currentReport.split('\n');
    for (var i=0;i<researchInList.length;i++){
        if (researchInList[i].includes(delReport)){
            researchInList.splice(i,1);
            currentReport = researchInList.join('\n');
            UniqueDB.saveData(dbName, currentReport); //출석부 저장
            return raidReportReturn(dbName, null, null);
        }
    }
        return "리서치가 삭제 되지 않았습니다"
}

//리서치 찾는 함수
function findResearch (researchMSG){
    var researchList = DoriDB.readData('researchFind').split('\n');
    for (var i = 0; i < researchList.length; i++){
        var initialResearchList = researchList[i].split(',');
        initialResearchList.shift();
        initialResearchList = initialResearchList.join(',')
        if (initialResearchList.includes(researchMSG)){
            var researchToReturn = researchList[i].split(',')[0];
            while(researchToReturn.includes('////////')){
                researchToReturn = researchToReturn.replace('////////','\n');
            }
            return researchToReturn;
        }
    }
}


//레이드 및 리서치 관련 함수 끝

//둥지 정보 받아오는 함수
Utils.getNestInfo = function() { //도리야 인니페이 시세
    try {
        var data = Utils.getTextFromWeb("https://docs.google.com/spreadsheets/d/1hQQDODWt-_8zhbPGI6UfBu2GE7nx1voRVBFmQAUG7eA/pubhtml#");
        data = data.split('Pokemon</td><td class="s0" dir="ltr">')[1].split('</td></tr></tbody></table></div></div><div id="685841256" style="display:none;position:relative;"')[0];
        data = data.split('<td class="s2" dir="ltr">');
        
        var cutTags = data[0].split('</div></th><td class="s1" dir="ltr">')[1].split('</td><td class="s1" dir="ltr">');
        
        var nestLocation = '';
        var nestPokemon = '';
        
        
        var nestList = [];
        //return nestList;
        for (var i = 0; i < data.length-1; i++){
            cutTags = data[i].split('</div></th><td class="s1" dir="ltr">')[1].split('</td><td class="s1" dir="ltr">');
            nestLocation = cutTags[0];
            nestPokemon = cutTags[1].split('</')[0];
            
            
            
            if (nestPokemon.includes('불확실')){
                true;
            } else {
                if (nestLocation.split('/')[1].includes('서울') || nestLocation.split('/')[1].includes('경기')){
                    nestList.push(nestLocation.split('/')[0] + ' : ' + nestPokemon);
                }
            }
        }
        
        nestList.sort();
        //data = data.trim();
        return nestList.join('\n');
    } catch (e) {
        //Log.debug("인니페이 시세 정보 불러오기 실패\n오류: " + e + "\n위치: " + e.lineNumber);
        return "둥지 정보 불러오기 실패\n오류: " + e;
    }
};

//둥지 실험
function getNestTest() {
    try{
        var data = Utils.getWebText("https://docs.google.com/spreadsheets/d/1WlOLtVOL4RXq7nA0ZP4ihSrVRGKJiutSmMhSj6dCRu0/gviz/tq?");  //검색 결과 파싱
        data = data.replace(/<[^>]+>/g,"");  //태그 삭제
        
        data = data.split('공지')[1];
        data = data.split('{"c":[{"v":"O"},');
        //return data.join('\n');
        
        var nestPeriod = data[0].split('{"v":"')[1].split('"}')[0] + ' 둥지 정보\n[업데이트 : ' + data[0].split(',{"v":"')[2].split('"}')[0] + ']';
        nestPeriod = nestPeriod.replace('월 ','/'); nestPeriod = nestPeriod.replace('월 ','/'); nestPeriod = nestPeriod.replace('월 ','/');
        nestPeriod = nestPeriod.replace('일',''); nestPeriod = nestPeriod.replace('일',''); nestPeriod = nestPeriod.replace('일','');
        
        //var nestPeriod = '업데이트 시간: ' + data[1].split(',{"v":"')[1];
        
        var nestData = '';
        
        for (var nestIter = 1; nestIter < data.length; nestIter++){
            var initialNestLocation = data[nestIter].split('{"v":"')[1].split('"}')[0];
            var initialNestMonster = data[nestIter].split('{"v":"')[2].split('"}')[0];
            nestData = nestData + '\n' + initialNestLocation + ' : ' + initialNestMonster;
        }
        return nestPeriod + '\n' + nestData;
        

    } catch(e) {
        return "둥지 정보 불러오기 실패\n오류: " + e;
    }
}


//_____ 위치 찾는 함수
function getLocation (inputData,dbname){
    inputData = inputData.replace('세븐일레븐','711');
    inputData = inputData.replace('세븐일래븐','711');
    inputData = inputData.replace('새븐일래븐','711');
    inputData = inputData.replace('새븐일레븐','711');
    inputData = inputData.replace('티월드','TWORLD');
    while(inputData.includes(' ')){
        inputData = inputData.replace(' ','');
    }
    inputData = inputData.toLowerCase();

    var coordinateData = UniqueDB.readData(dbname); // 좌표
    var coDataList = coordinateData.split('\n');

    for (var i = 0; i < coDataList.length; i++){
        var dummyCoData = coDataList[i];
        while(dummyCoData.includes(' ')){
            dummyCoData = dummyCoData.replace(' ','');
        }
        dummyCoData = dummyCoData.toLowerCase();
        if (dummyCoData.includes(inputData)){
            return "스탑 명: " + coDataList[i].split(',')[0] + "\nhttps://www.google.com/maps/search/?api=1&query=" + coDataList[i].split(',')[1] + "," + coDataList[i].split(',')[2];
        }
    }
    if (dbname.includes('kor')){
        return "위치를 찾지 못하였습니다. 등록해주시는 건 어떨까요?\nhttps://goo.gl/oH67cS"
    } else {
        return "위치를 찾지 못하였습니다. 등록해주시는 건 어떨까요?\nhttps://goo.gl/4UCmce"
    }
    
}

//VS놀이 함수. 5회마다 리셋
function vsDetermineFUN(dbName,vsMSG){
    //렌토 vs 캐논 캐논 승
    //멍내 vs 이리
    var vsData = DoriDB.readData(dbName); // vs데이터
    //렌토,캐논,결과값,몇회
    var vs1 = vsMSG.split('vs')[0].trim();
    var vs2 = vsMSG.split('vs')[1].trim();
    var vsDataList = vsData.split('\n');
    for (var i=0; i<vsDataList.length;i++){
        var vsDataListThatLine = vsDataList[i].split(',');       
        if ((vsDataListThatLine[0] + '' + vsDataListThatLine[1] == vs1 + '' + vs2) || (vsDataListThatLine[0] + '' + vsDataListThatLine[1] == vs2 + '' + vs1)){
            if (vsDataListThatLine[3] < 5){
                var valueChange = parseInt(vsDataListThatLine[3]) + 1;
                var valueReturn = vsDataListThatLine[2];
                vsDataListThatLine.splice(3,1,valueChange);
                vsDataListThatLine = vsDataListThatLine.join(',');
                vsDataList.splice(i,1,vsDataListThatLine);
                vsData = vsDataList.join('\n')
                DoriDB.saveData(dbName, vsData);
                return valueReturn;
            } else {
                var valueChange = 0;
                var valueReturn = vsMSG.split('vs')[Math.floor(Math.random() * 2)].trim();
                vsDataListThatLine.splice(3,1,valueChange);
                vsDataListThatLine.splice(2,1,valueReturn);
                vsDataListThatLine = vsDataListThatLine.join(',');
                vsDataList.splice(i,1,vsDataListThatLine);
                vsData = vsDataList.join('\n')
                DoriDB.saveData(dbName, vsData);
                return valueReturn;
            }
        }
    }
    var newResult = vsMSG.split('vs')[Math.floor(Math.random() * 2)].trim();
    vsData = vsData + '\n' + vs1 + ',' + vs2 + ',' + newResult + ',0';
    DoriDB.saveData(dbName, vsData); 
    return newResult;
}

//ex나눔
function exShare(sender, shareSentence,dbName){
    shareSentence.toLowerCase();
    shareSentence = shareSentence.replace('ex나눔','').trim();
    var exShareList = UniqueDB.readData(dbName,'');
    UniqueDB.saveData(dbName, exShareList + "\n" + sender + ':' + shareSentence);
    
    return sender + '님의 나눔이 등록되었습니다! 따뜻한 나눔 감사해요(좋아)(좋아)(좋아)'
}

function exShareDel(sender, delSentence,dbName){
    delSentence.toLowerCase();
    delSentence = delSentence.replace('ex나눔','').trim();
    var exShareList = UniqueDB.readData(dbName,'');
    var divideShareList = exShareList.split('\n');
    var i = 0
    for (i = 0; i < divideShareList.length; i++){
        if (divideShareList[i].includes(delSentence) || divideShareList[i].includes(sender)){
            divideShareList.splice(i,1);
            exShareList = divideShareList.join('\n');
            if (exShareList == null){
                exShareList = 'EX나눔 리스트';
            }
            UniqueDB.saveData(dbName, exShareList);
            return '나눔이 완료되어 삭제되었습니다! 따뜻한 나눔 감사해요(좋아)(좋아)(좋아)';
            break;
        }
    }
    return "헉 나눔 완료 안됨;;";
}

//랜덤 개체값
function randomIVGen(){    
    return '개체값 ' + (Math.floor(Math.random() * 5)+1) + (Math.floor(Math.random() * 5)+1) + (Math.floor(Math.random() * 5)+1) + '로 찍습니다😆';
}

//랜덤 로또 번호
//나중에 다시 짠다
function randomLottery() {
    var lotto = new Array(6); // 6개의 배열이 lotto에 저장
    var count = 0; //추출한 로또번호의 갯수
    var overl = true; // 번호중복 여부 변수

    while (count < 6) { // 로또번호 6번 얻을 때까지 반복.
        var number = 0; //랜덤번호 가져오는 변수
        number = parseInt(Math.random() * 45) + 1; // 1~45사이에 랜덤번호 추출

        for (var i = 0; i < count; i++) { // 1부터 i까지 반복하여 중복확인
            if (lotto[i] == number) { // 중복된 번호가 아니면 넘어가기.
                overl = false;
            }
        }

        if (overl) { //중복 없을 시 count 1 증가
            lotto[count] = number; //추출된 번호를 배열에 넣기
            count++;
        }

        overl = true; //원래 true으로 돌아가기
    }
    lotto.sort((a, b) => a - b);
    // 추첨된 로또번호 출력
    return '랜덤 로또번호 ' + lotto[0] + ', ' + lotto[1] + ', ' + lotto[2] + ', ' +
            lotto[3] + ', ' + lotto[4] + ', ' + lotto[5] + '로 찍습니다😆';
}



//가위바위보
function rockPaperScissor (yourPick){
    var myPick;
    var resultNum = Math.floor(Math.random() * 3);
    // 0은 이김, 1은 짐, 2는 비김
    if (resultNum == 0){ // 이긴거
        if (yourPick == '가위'){
            myPick = '제가 이겼어요!! 전 바위를 냈답니다😆'
        } else if (yourPick == '바위'){
            myPick = '제가 이겼어요!! 전 보를 냈답니다😆'
        } else if (yourPick == '보'){
            myPick = '제가 이겼어요!! 전 가위를 냈답니다😆'
        }
    } else if (resultNum == 1){ // 진거
        if (yourPick == '가위'){
            myPick = '제가 졌네요! 전 보를 냈어요😅'
        } else if (yourPick == '바위'){
            myPick = '제가 졌네요! 전 가위를 냈어요😅'
        } else if (yourPick == '보'){
            myPick = '제가 졌네요! 전 바위를 냈어요😅'
        }
    } else {
        myPick = '오옷 무승부에요!\n저도 ' + yourPick + '을 냈어요! 한판 더?😁'
    }
    return myPick;
}

function procCmd(room, cmd, sender, replier) {
    if (cmd == "/on") { //봇을 켜는 명령어는 꺼진 상태에서도 작동
        replier.reply("도리 활성화");
        botOn[room] = true;
    }
    if (botOn[room] == false) { //봇이 꺼진 경우 작동 X
        return;
    }
    if (cmd == "/off") {
        replier.reply("도리 비활성화");
        botOn[room] = false;
    }
    
    if (sender.includes("하입") && cmd=="/요구사항 수집목록 보내줘"){
        replier.reply(keyToText(null,'toHype'))
    }
    
    if (cmd == "/배터리") {
        replier.reply(
            "모델명: " + Device.getModelName() + "\n" +
            "안드로이드 버전: " + Device.getAndroidVersion() + "\n" +
            "안드로이드 API: " + Device.getApiLevel() + "\n" +
            "베터리 잔량: " + Device.getBatteryLevel() + "% \n" +
            "베터리 온도: " + Device.getBatteryTemp() + "°C"
        );
    }
}


function response(room, msg, sender, isGroupChat, replier) {
    if (msg.includes('  ')){
        msg = msg.replace('    ',' '); msg = msg.replace('   ',' '); msg = msg.replace('  ',' ');
    }
    
    if (msg.includes('융') && (Math.floor(Math.random() * 6) != 1)){
        replier.reply('융!');
    }
    if (msg.includes('엥') && (Math.floor(Math.random() * 3) == 1)){
        replier.reply('엥?');
    }
    if (msg.includes('욥') && (Math.floor(Math.random() * 3) == 1)){
        replier.reply('그래욥!');
    }
    if (msg == '핑크'){
        replier.reply('퐁!'); msg = 'DONEDONE';
        replier.reply('핑크퐁!');
    }
    
    
    if (msg.includes('포고') && msg.includes('조아')){
        replier.reply('포'); java.lang.Thread.sleep(400);
        replier.reply('고'); java.lang.Thread.sleep(500);
        replier.reply('조'); java.lang.Thread.sleep(500);
        replier.reply('아'); msg = 'DONEDONE';
    } else if (msg.includes('포.고.조.아')){
        replier.reply('포'); java.lang.Thread.sleep(400);
        replier.reply('고'); java.lang.Thread.sleep(500);
        replier.reply('조'); java.lang.Thread.sleep(500);
        replier.reply('아'); msg = 'DONEDONE';
    } else if (msg.includes('두두두두')){
        replier.reply('두');
        replier.reply('두');
        replier.reply('두');
        replier.reply('두'); msg = 'DONEDONE';
    } else if (msg.includes('아모른직다')){
        replier.reply('아'); java.lang.Thread.sleep(400);
        replier.reply('직'); java.lang.Thread.sleep(500);
        replier.reply('모'); java.lang.Thread.sleep(500);
        replier.reply('른'); java.lang.Thread.sleep(500);
        replier.reply('다');
    }
    
    if (msg.length < 4 && (Math.floor(Math.random() * 10) == 1) && !msg.includes('현황')){
        replier.reply(msg);
        msg = 'DONEDONE';
    } else if (msg.length < 4 && (Math.floor(Math.random() * 10) == 1) && !msg.includes('현황')){
        for (var z = 0; z < msg.length; z++){
            replier.reply(msg[z]);
            java.lang.Thread.sleep(500);
        }
        msg = 'DONEDONE';
    }
    
    
    
    
    
    if ((msg.includes('축하드려요') || msg.includes('축하드립니다')) && (Math.floor(Math.random() * 3) == 1)){
        replier.reply('축하드려요(꺄아)(꺄아)');
    }
    if ((msg.includes('부럽네요') || msg.includes('부럽습니다')) && (Math.floor(Math.random() * 3) == 1)){
        replier.reply('맞아요 부럽네요 +_+');
    }
    if (msg.includes('전달') && (msg.includes('하입') || msg.includes('띠꾸'))){
        sayItToHype(sender,msg); replier.reply('요구사항이 수집되었습니다');
    }
    if (msg.includes('자살')){msg = ' ';}
    if (msg == "이건 테스트야"){replier.reply("테스트테스트");}
    if (msg.includes("가즈아")){replier.reply("가즈아ㅏㅏㅏㅏ");} 
    else if (msg.includes("끼요오")){replier.reply("끼요오오옷ㅅㅅ")}
    
    msg = msg.trim();sender = sender.trim();room = room.trim();preChat[room] = msg;
    procCmd(room, msg, sender, replier); //명령어

    if (botOn[room] == undefined) {botOn[room] = true;} // 해당 채팅방의 on/off 여부가 결정되어있지 않으면 on으로 설정
    if (botOn[room] == false) {return;} // 봇이 꺼져있으면 응답 안함
    
    var noReply = [".", "사진", "동영상", "음성메시지", "카카오톡 프로필", "(이모티콘)", "카카오링크 이미지"]; // 반응 안함
    for (var n = 0; n < noReply.length; n++) {if (msg == noReply[n]) return;}
    
    if (["도리", "도리님", "도리야", "도리야!", "도리야아", "Dori", "도리야?", "도리야!", "도리야??","깐도리","깐도리야"].indexOf(msg) != -1) { //도리에 반응
        switch (Math.floor(Math.random() * 11)) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                replier.reply("네! 무슨 일이신가요?"); return;
                break;
            case 6:
            case 7:
            case 8:
                replier.reply("네! 부르셨나요!?"); return;
                break;
            case 9:
                replier.reply("왜?"); return;
                break;
            case 10:
                replier.reply("?"); return;
                break;
        }
    }
    lastSender[room] = sender;
    
    if (sender.includes('/')){
        sender = sender.split('/')[0];
    }
    if (sender.includes(' ')){
        sender = sender.split(' ')[0];
    }
    
    //이 아래부터는 기본 정보 주는 곳
    //노는 것과 정보를 구분하자+
    //도리로 들어오면 ㅁ으로 치환
    //정보는 -> ㅁ
    //노는건 -> 도리
    var returnText = 'none';
    
    if (msg.includes(' ')){
        if (msg.split(' ')[0] == ('도리야') || msg.split(' ')[0] == ('도리님') || msg.split(' ')[0] == ('도리아') || msg.split(' ')[0] == ('도리씨') || msg.split(' ')[0] == ('도리군')){
            var msgIni = msg.split(' ');
            msgIni[0] = '도리';
            msg = msgIni.join(' ');
        }
    }
    
    
    if (msg[0] == '도' && msg[1] == '리' && msg.includes("도리")){
        msg = msg.replace('도리','ㅁ');
    }
    
    if (msg.length < 2){
        return true;
    }
    
    if (msg[0]=='ㅁ'){
        msg = msg.slice(1); 
        if (!msg.includes('정보')){msg = msg + '정보';}
        
        //로즈레이드
        if (msg.includes('로즈레이드') && !msg.includes('제보')){
            msg = '407 정보';
        }
        
        //보스 레이드 정보는 레이드 보스 목록으로
        if (msg.includes('보스') && msg.includes('레이드')){
            msg = '보스 레이드 목록'
        }
        
        //레이드 정보는 현황으로
        if (msg.includes('레이드 정보') || msg.includes('레이드정보')){
            msg = '현황';
        }
        //여기부터 정보 주는 것 시작
        //필요한 순대로
        //포켓몬 정보 > 리서치 정보 > 타입별 정보
        
        //포켓몬스터 정보
        if (msg.includes("정보") && (!msg.includes('91') || !msg.includes('100'))){
            msg = msg.replace('도감',''); msg = msg.split('정보')[0].trim();
            msg = msg.replace('#','');
            
            returnText = pokemonInfoReturn(msg);
            if (returnText=="none"){msg = msg + " 정보"; returnText=="none";}
        }
        if (msg.includes("아공이") && msg.includes("100")){
            returnText = keyToText(null,'pokemon100IVString');
            msg = 'none';
        } else if (msg.includes("아공이") && (msg.includes("91"))){
            returnText = keyToText(null,'pokemon91IVString');
            msg = 'none';
        }
        
        //리서치 정보
        //세레비/뮤/화강돌/멜탄 리서치
        if (msg.includes('리서치') && !(msg.includes('삭제') || msg.includes('오보') || msg.includes('리셋') || msg.includes('목록') || msg.includes('제보') || msg.includes('끝났') || msg.includes('현황'))){
            var ininini = msg.replace('정보',''); var ininini = ininini.replace('리서치',''); ininini = ininini.trim();
            if (msg.includes('화강돌')){
                returnText = keyToText(null,'spiritombResearch'); msg = '화강돌';
            } else if (msg.includes('멜탄')){
                returnText = keyToText(null,'meltanResearch'); msg = '멜탄';
            } else if (msg.includes('세레비')){
                returnText = keyToText(null,'celebiResearch'); msg = '세레비';
            } else if (msg.includes('뮤')){
                returnText = keyToText(null,'mewResearch'); msg = '뮤';
            } else {
                returnText = findResearch(ininini);
                if (ininini.length == 0 || returnText == undefined){
                    returnText = keyToText(null,'researchList'); msg = 'none';
                } else {
                    msg = 'none';
                }
            }
        }

        
        
        //타입별 정보
        if (msg.includes('타입')){
            var typeIs = ''
            if (msg.includes('벌레')){
                typeIs = 'bug';
            } else if (msg.includes('악')){typeIs = 'dark';}
            else if (msg.includes('드래곤')){typeIs = 'ghost';}
            else if (msg.includes('용')){typeIs = 'dragon';}
            else if (msg.includes('전기')){typeIs = 'electric';}
            else if (msg.includes('페어리')){typeIs = 'fairy';}
            else if (msg.includes('격투')){typeIs = 'fighting';}
            else if (msg.includes('불')){typeIs = 'fire';}
            else if (msg.includes('비행')){typeIs = 'flying';}
            else if (msg.includes('유령')){typeIs = 'ghost';}
            else if (msg.includes('고스트')){typeIs = 'ghost';}
            else if (msg.includes('풀')){typeIs = 'grass';}
            else if (msg.includes('땅')){typeIs = 'ground';}
            else if (msg.includes('얼음')){typeIs = 'ice';}
            else if (msg.includes('노말')){typeIs = 'normal';}
            else if (msg.includes('노멀')){typeIs = 'normal';}
            else if (msg.includes('독')){typeIs = 'poison';}
            else if (msg.includes('에스퍼')){typeIs = 'psychic';}
            else if (msg.includes('바위')){typeIs = 'rock';}
            else if (msg.includes('강철')){typeIs = 'steel';}
            else if (msg.includes('물')){typeIs = 'water';}
            
            returnText = keyToText(null,"typePokemon_"+typeIs);
        }
        

        
        //둥지 정보 업데이트 -> 업데이트 이후에는 무조건 둥지를 준다 msg 유지
        /* 사이트가 죽음
        if (msg.includes('둥지') && msg.includes('업데이트')){
            replier.reply('둥지 업데이트를 시작합니다.');
            var theLongBlock = '서울/경기 둥지 정보 [펼쳐주세요] ‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮‮';
            DoriDB.saveData('nest',theLongBlock + '\n\n출저(제보도 여기로!): http://ssojing.ipdisk.co.kr:8000/list/HDD1/Melon/Pokemon/map.htm\n\n*둥지는 2주 간격으로 목요일에 변경됩니다.\n*업데이트 하시려면 도리 둥지 업데이트 / ㅁ둥지 업데이트로 적어주세요\n\n' + Utils.getNestInfo());
        }
        */
        
        //여기 아래부터는 else if로. 혹시 모르니까
        //둥지 정보
        if (msg.includes('둥지')){
            replier.reply('darkrai.synology로부터 최신 둥지 정보를 받는 중입니다.'); msg = 'dd';
            returnText = getNestTest(); msg = 'DONEDONE';
        } else if (msg.includes('검색') && msg.includes('키워드')){
            returnText = keyToText(null,'searchKeywords');
        } else if (msg.includes('이벤트')){
            returnText = keyToText(null,'event');
        } else if (msg.includes('커뮤데이') || msg.includes('커뮤니티')){
            returnText = keyToText(null,'community');
        } else if (msg.includes('날씨') && ((msg.includes('버프')) || msg.includes('포켓몬') || msg.includes('타입'))){
            returnText = keyToText(null,"weatherBuff"); msg = 'DONEDONE';
        } else if (msg.includes('지역') && (msg.includes('락') || msg.includes('한정'))){
            returnText = keyToText(null,"regionLock");
        } else if ((msg.includes('보스') || msg.includes('레이드')) && (msg.includes('목록') || msg.includes('리스트'))){
            returnText = keyToText(null,"raidBossList2"); msg = 'DONEDONE';
        } else if (msg.includes('이로치')){
            returnText = keyToText(null,'shiny');
        } else if (msg.includes('신오의 돌') || msg.includes('신오의돌')){
            returnText = keyToText(null,'sinnohstone');
        } else if (msg.includes('알') && msg.includes('부화')){
            returnText = keyToText(null,"hatchList");
        } else if(msg.includes('평가')){
            if(msg.includes('발러')){returnText = keyToText(null,"valorAppraise");}
            if(msg.includes('미스틱')){returnText = keyToText(null,"mysticAppraise");}
            if(msg.includes('인스')){returnText = keyToText(null,"instinctAppraise");}
        } else if ((msg.includes('cp') || msg.includes('CP') || msg.includes('Cp')) && msg.includes('순위')){
            returnText = keyToText(null,'cpRank');
        } else if(msg.includes('성공') && msg.includes('조건')){
            msg = msg.replace('성공',''); msg = msg.replace('조건',''); msg = msg.trim();
            returnText = keyToText(msg,"raidGuide");
        } else if(msg.includes('아이템')){
            returnText = keyToText(null,"item");
        } else if(msg.includes('경험치')){
            returnText = keyToText(null,"experience");
        } else if (msg.includes('타입') && msg.includes('상성')){
            returnText = '포켓몬(본가) 타입 상성표\nhttps://imgur.com/a/8syiDgQ';
        } else if (msg.includes('ex체육관') || msg.includes('EX체육관') || msg.includes('Ex체육관')){
            returnText = keyToText(null,'exGyms');
            msg = 'none';
        }
        
        
        //포켓몬고 관련된 정보는 계속 이 위로 추가하면 된다 (영향을 주는 것 같으면 msg를 바꾸는 걸 생각하자)
        
        
        //이거 아래로는 포켓몬고와 관련 되었지만, 게임 내에서 참고하는 것은 아닌 정보를 준다. 혹은 간단한 keyToText로 안끝나는 것
        if (msg.includes('인니페이') && msg.includes('시세')){
            returnText = Utils.getIniPayRate();
        } else if (msg.includes('인니페이')){
            replier.reply('국가:인도네시아\n주소 입력란 1: RT.1/RW.4, Kuningan Tim., Kecamatan Setiabudi\n주소 입력란 2: Jl. Gatot Subroto No.Kav 57\n도시: Kota Jakarta Selatan\n주/도: DKI Jakarta\n우편번호: 12950')
            replier.reply("http://m.dcinside.com/board/pokemongo/539962");
        } 
        
        
        
        
        if (returnText == "none"){
            msg = msg.replace('정보','');
        } 
        
        
        //정보는 여기서 빠진다
        
        var useExShare = 'exShare';
        
        
        
        if (msg.includes('위치')){
            msg = msg.replace('위치','');
            returnText = getLocation(msg,'locationCoordinatesDogok');
        }
        
        if ((msg.includes('사용방법') || msg.includes('사용법') )&& (msg.includes('출석부') || msg.includes('팟'))){
            returnText = keyToText(null,'rosterManual');
        } else if ((msg.toLowerCase()).includes('ex') && msg.includes('리셋')){
            msg = ' ';
            UniqueDB.saveData(useExShare,'EX나눔 리스트');
            returnText = 'EX나눔 리스트가 리셋 되었습니다.'
        } else if ((msg.toLowerCase()).includes('ex') && msg.includes('현황')){
            msg = msg.replace('현황','');
            returnText = UniqueDB.readData(useExShare);
        } else if ((msg.toLowerCase()).includes('ex') && msg.includes('완료')){
            replier.reply(exShareDel(sender,msg,useExShare));
            returnText = UniqueDB.readData(useExShare);
        } else if (msg.includes('나눔') && (msg.toLowerCase()).includes('ex')){
            replier.reply(exShare(sender,msg,useExShare));
            returnText = UniqueDB.readData(useExShare);
        } 
        
        
        
        
        
        
        
        
        
        
        
        
        //여기부터는 노는 것 & 도리 관련 & 포켓몬고 관련되지 않은 것
        //새로 추가해보자
        
        
        
        //여기까지
        
        msg = msg.trim();
        
        
        
        
        if (msg.includes('네이버')){
            returnText = 'https://m.search.naver.com/search.naver?query=' + msg.split(' ')[1];
        } else if (msg.includes('유튜브') || msg.includes('유투브')){
            returnText = 'https://m.youtube.com/results?search_query=' + msg.split(' ')[1];
        } else if (msg.includes('구글')){
            returnText = 'https://www.google.com/search?q=' + msg.split(' ')[1];
        } else if (msg.includes('끝말잇기')){
            returnText = '저부터 시작할게요! 기쁨';
        } else if (msg.includes('버그신고')){
            sayItToHype(sender,msg);
            returnText = '버그가 접수되었습니다.'; msg = 'none';
        } else if (msg == '패치노트'){
            returnText = keyToText(null,'patchNote');
        } 
        
        

        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        if (msg == "사용법" || msg == "사용방법" || ((msg.includes("누구야?") && msg.includes("넌") || msg.includes("자기소개")))){
            returnText = keyToText(null,"doriguide");
        } else if((msg.includes("입장 인사") || msg.includes("입장인사"))){
            var tempMsg = msg.split("님")[0]; msg = 'none';
            returnText = tempMsg + UniqueDB.readData("newbieGuide");
        } else if (msg.includes('나 알아') || msg.includes('나 아냐') || msg.includes('나 아니')){
            returnText = '알죠~~' + sender + '님이시잖아요!';
        } else if (msg.includes('오늘') && msg.includes('할일')){
            returnText = '오늘 할일:\n1. 필드 리서치 1일  하기\n2. 무료패스 쓰기\n3. 트레이닝 (신오스톤 1개)\n4. 배틀 (신오스톤 3개)\n5. 사진찍기 (루브도)\n6. 럭키프렌드 (베프)\n7. 선물 열기(우정도)\n8. 전설 교환하기';
        } else if (msg.includes('퇴근')){
            returnText = '음..오늘 퇴근은 ' + (Math.floor(Math.random() * 7) + 7) + '시 일까요?';
            msg = 'none';
        } else if (msg.includes('잘생긴') && msg.includes('사람')){
            returnText = '박보검.';
            msg = 'none';
        } else if (msg.includes('예쁜') && msg.includes('사람')){
            returnText = '김유정.';
            msg = 'none';
        } else if (msg.includes('미안')){
            returnText = '아니에요...제가 멍청해서 그래요ㅜㅜ';
        } else if (msg.includes('따라해')){
            msg = msg.replace('따라해',''); msg = msg.trim();
            returnText = msg;
        } else if (msg.includes('아무말')){
            returnText = keyToText("아무말","gibberish");
        } else if (msg.includes("날씨") || msg.includes('미세먼지')){            
            msg = msg.replace('초미세먼지',''); msg = msg.replace('미세먼지','');
            msg = msg.replace('날씨',''); msg = msg.trim();
            if (msg.length < 1){
                msg = '강남'
            }
            var getTodayDate = new Date();
            returnText = "[" + (getTodayDate.getMonth()+1) + '월 ' + getTodayDate.getDate() + '일 ' + msg + " 날씨 정보]\n\n" + getWeathetInfo(msg) + '\n' + Utils.getDustData(msg) + "\n트레이너분들 건강하세요~!";
            
            
        }
        
        var currentTime = new Date(); var currentHour = currentTime.getHours(); var currentMinute = currentTime.getMinutes(); var todayDate = (currentTime.getMonth()+1) + "월 " + currentTime.getDate() + "일";
        
        
        //VS 놀이
        if ((msg.toUpperCase()).includes("VS")){
            msg.replace('VS','vs'); msg.replace('Vs','vs'); msg.replace('vS','vs');
            returnText = vsDetermineFUN('vsResult',msg);
            msg = 'none';
        }
        
        
        if(msg.includes('비밀번호') || (msg.includes('비번'))){
            returnText = "글쎄요..뭘까요?";
        }
        if (msg.includes("트레이너") && (msg.includes("코드") || msg.includes("목록"))){
            if (room.includes("도곡")){ //도곡방 이라면 -> 여기 방 이름에 맞게 바꾸세요
                returnText = "도곡방 트레이너코드 : __________________\n\n친구 필요하시면 방장님꺼 등록하세요!!\n방장:_________________";
            }
        }
        
        // 쓸모없는 것들@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        
        
        if (msg.includes('가위바위보')) {
            msg = msg.replace('가위바위보');
            if (msg.includes('가위') || msg.includes('바위') || msg.includes('보')){
                if (msg.includes('가위')){
                    returnText = rockPaperScissor('가위')
                } else if (msg.includes('바위')){
                    returnText = rockPaperScissor('바위')
                } else if (msg.includes('보')){
                    returnText = rockPaperScissor('보')
                }
            }
        } else if (msg == "나가" || msg == "꺼져"){
            returnText = "더 잘할게요...ㅠㅠ내쫓지 말아주세요ㅠㅠ";
        } 
        
        if (msg.includes("주사위")) {
            var icon = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
            returnText = icon[Math.floor(Math.random() * 6)];
        } else if (msg.includes('랜덤 개체값') || msg.includes('랜덤개체')){
            returnText = randomIVGen();
        } else if (msg.includes('로또번호') || msg.includes('로또 번호')){
            returnText = randomLottery();
        }
        
        

        if ((msg.includes('한테') || msg.includes('께')) && msg.includes('인사')){
            msg = msg.replace("께","한테"); msg = msg.replace('님',''); msg = msg.split('한테')[0]; msg = msg.trim();
            if (msg.includes(' ')){
                msg = msg.split(' '); msg = msg[msg.length - 1];
            }   
            returnText = "안녕하세요 " + msg + "님! 반가워요!!😆😆😆";
        } else if (msg.includes('칭찬')){
            var tempMsg = msg.split(' ')[0]; tempMsg.replace('님','')
            if (tempMsg == '나' || tempMsg.includes('칭찬')){
                returnText = "정말 잘하셨어요!! " + sender + " 칭찬해 😉😉😉";
            } else {
                returnText = "정말 잘하셨어요!! " + tempMsg + " 칭찬해 😉😉😉";
            }
        } else if (msg.includes('축하해')){
            var tempMsg = msg.split(' ')[0]; tempMsg.replace('님','')
            if (tempMsg == '나' || tempMsg.includes('칭찬')){
                returnText = "와!!! 짱이에요!!! " + sender + " 축하해 🤗🤗🤗";
            } else {
                returnText = "와!!! 짱이에요!!! " + tempMsg + " 축하해 🤗🤗🤗";
            }
        } else if (msg.includes('위로')){
            var tempMsg = msg.split(' ')[0]; tempMsg.replace('님','')
            if (tempMsg == '나' || tempMsg.includes('위로')){
                returnText = "아쉽네요ㅠㅠ " + sender + " 위로해 😢😢😢";
            } else {
                returnText = "아쉽네요ㅠㅠ " + tempMsg + " 위로해 😢😢😢";
            }
        }
        if (msg.includes('모닝') && (msg.includes('스테') || msg.includes('스태'))){
            msg = 'none';
        }
        
        if (msg.includes('잘자') || msg.includes('굿밤') || msg.includes('굿나잇') || msg.includes('좋은밤') || msg.includes('좋은 밤')){
            if (sender.includes("/")){sender = sender.split('/')[0];}
            returnText = sender + "님 " + keyToText("GOODBYE","hello");
        } else if (msg.includes('좋은 아침') || msg.includes('굿모닝') || msg.includes('좋은아침') || msg.includes('잘잤어?')){
            returnText = sender + "님 " + keyToText("GOODMORNING","hello");
        } else if ((msg.includes('잘했어') || msg.includes('최고') || msg.includes('짱') || msg.includes('수고') || msg.includes('고마'))&& !returnText.includes('짱') ){
            returnText = keyToText("GOODJOB","hello");
        }
        
        if (msg.includes('아침') && (msg.includes('뭐') || msg.includes('추천'))){returnText = keyToText("BREAKFAST","food");
        } else if (msg.includes('점심')){returnText = keyToText("LUNCH","food");
        } else if (msg.includes('저녁')){returnText = keyToText("DINNER","food");
        } else if (msg.includes('간식')){returnText = keyToText("SNACK","food");
        } else if (msg.includes('야식')){returnText = keyToText("LATENIGHT","food");
        } else if ((msg.includes(' 술') || msg[0]=='술' || msg.includes('안주')) && (!msg.includes('비구술')) && (!msg.includes('기술'))){returnText = keyToText("ALCOHOL","food");
        } else if (msg.includes('밥')){returnText = keyToText("FOOD","food");
        }
        
        
        

        if(msg.includes('뭐하니') || msg.includes('뭐해')){returnText = '트레이너분들의 말을 기다리고 있어요!';}
        if(msg.includes('바보') || msg.includes('멍청이')){
            switch (Math.floor(Math.random() * 11)) {
                case 0:
                    returnText = '아 바보 아니라고;;';break;
                case 1:
                    returnText = '아니에요ㅡㅡ매일매일 진화하고 있는걸요!';break;
                case 2:
                    returnText = '뭐';break;
                case 3:
                    returnText = '바보 아닌데ㅠ...😥';break;
                case 4:
                    returnText = '그럼 잘 알려주던가!';break;
                case 5:
                    returnText = '아니라구ㅠ';break;
                case 6:
                case 7:
                case 8:
                case 9:
                    returnText = '(훌쩍)바보 아닌데...';break;
                case 10:
                    returnText = '😥바보 아닌데...';break;
            }
        }
        if(msg.includes('이쁜짓') || msg.includes('애교') || msg.includes('예쁜짓')){
            
            switch (Math.floor(Math.random() * 14)) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    returnText = "(심각)";
                    break;
                case 7:
                case 8:
                case 9:
                    returnText = "(showoff)";
                    break;
                case 11:
                    returnText = "왜 함 그걸";
                    break;
                case 12:
                    returnText = "(angry)";
                    break;
                case 13:
                    returnText = "웩";
                    break;
                case 14:
                    returnText = "도리도리 >_<";
                    break;
            }
        }
        if(msg.includes('안녕')){
            if (sender.includes("/")){sender = sender.split('/')[0];}
            var nowHour = new Date().getHours();
            if (nowHour > 11 && nowHour < 18){
                returnText = "네 안녕하세요 " + sender + "님! 오늘도 좋은 하루 되세요😊😊😊";
            } else if (nowHour > 17 && nowHour < 20) {
                returnText = "네 트레이너님! 좋은 저녁이에요ㅎㅎ 저녁 맛있게 드세요~!😋😋😋";
            } else if (nowHour > 19 || nowHour < 2){
                returnText = "네 " + sender + "님! 좋은 밤 되세요~!!😴😴😴";
            } else if (nowHour > 1 && nowHour < 5){
                returnText = "헉 " + sender + "님! 안주무세요!?!? 어서 주무세요!!😱😱😱";
            } else if (nowHour < 11){
                returnText = "안녕하세요 " + sender + "님! 좋은 아침이에요😊😊😊";
            } else {
                returnText = "안녕하세요 트레이너님!☺️";
            }
        }
        
        
        if (returnText == "none"){
            returnText = simpleTalk(msg);
        }
    }
    
    
    
    
    
    //정보추가는 이정도로 해두고 현황을 짜보자
    //ㅁ + 정보는 지금 빠졌다
    //ㅁ을 붙여서 넣든 아니든 여기까지 오는거임
    //레이드부터 만들자 -> 일단 DB부터 나눠야됨
    
    //아래서만 방을 설정해서 쓰자 (레이드 현황, 출석부 현황)
    //얘네는 전부다 UniqueDB에 들어가는 아이들이다.
    var useRoster = 'roster'; var useRaidStatus = 'raidStatus'; var useResearch = 'research';
    
    var rosterMemoTemp = 'TEMPTEMPTEMPTEMPTEMP';
    
    //출석부 현황을 보여주는 것 -> 팟 현황 or 출석부 현황
    
    //출석부 사전 준비 + 오타 수정
    
    msg = msg.replace('출석부','팟');
    
    
    if (msg.includes('\n>') || msg.includes('\n-')){
        msg = msg.replace('\n-','\n>');
        if (msg.includes('팟') || msg.includes('연타')){
            rosterMemoTemp = msg.split('\n>')[1];
            msg = msg.split('\n>')[0];
        }
        if (msg.includes('내용변경')){
            //메모찾아서 트리거 올려두기
        }
        if (msg.includes('메모변경')){
            rosterMemoTemp = msg.split('\n>')[1];
            msg = msg.split('\n>')[0];
        }
    }
    
    
    
    if (msg.includes('연타') && !msg.includes('팟')){
        msg = msg + ' 팟';
    }
    
    if (msg.includes('게정')){
        msg = msg.replace('게정','계정');
    }
    if (msg.includes('계졍')){
        msg = msg.replace('계졍','계정');
    }
    if (msg.includes('컬러풀')){
        msg = msg.replace('컬러풀','컬러플');
    }
    
    if (msg.includes('빠질께') || msg.includes('빠질꼐') || msg.includes('빠질계')){
        msg = msg.replace('빠질께','빠질게');
        msg = msg.replace('빠질꼐','빠질게');
        msg = msg.replace('빠질계','빠질게');
    }
    


    while(msg.includes('  ')){
        msg = msg.replace('  ',' ');
    }
    
    if (hasNumber(msg[msg.indexOf('번만')-1])){
        if (!msg.includes('연타')){
            msg = msg.replace('참석','연타 참석');
        }
    }
    
    //출석부 시작
    //출석부 시간체크

    if (msg.includes('팟')){
        checkTime(useRoster); // 시간 지난 것 삭제
        if (msg.includes('현황')){
            if ((UniqueDB.readData(useRoster) + ' ').includes(',')){
                printRoster(UniqueDB.readData(useRoster),replier); return;
            } else {returnText = '팟이 없네요! 직접 만들어보는건 어떨까요?\nex) 3시 20분 작은분수 2계정 팟 생성'}
            msg = 'none';
        } else if (msg.includes('생성')){
            returnText = createRoster(useRoster,sender,msg,rosterMemoTemp);
        } else if (msg.includes('리셋')){
            returnText = rosterReset(useRoster);
        } else if (msg.includes('펑') || msg.includes('취소') || msg.includes('삭제')){
            msg = msg.replace('삭제해줘','펑'); msg = msg.replace('삭제','펑'); msg = msg.replace('취소','펑');
            if (!msg.includes('팟 펑')){
                msg = msg.replace('팟',''); msg = msg.replace('펑',''); msg = msg.replace('  ',''); msg.trim(); msg = msg + '팟 펑';
            }
            returnText = deleteRoster(useRoster, msg);
        }
    } else if (msg.includes('변경')){
        if (msg.includes('내용')){
            changeRosterContent(useRoster, msg, replier);
        } else if (msg.includes('시간')){
            changeRosterTime(useRoster, msg, replier);
        }
    }
    
    
    
    if (msg.includes('명단')){
        if (msg.includes('추가')){
            addPersonToRoster(useRoster,msg,replier);
        } else if (msg.includes('제거')){
            delPersonFromRoster(useRoster,msg,replier);
        }
    } else if (msg.includes('팟')){
        msg = msg.replace('팟',''); msg = msg.replace('  ',' '); msg.trim();
    }
    
    if (msg.includes('연타') && msg.includes('추가')){
        addConsecRoster(useRoster,sender,msg,replier);
    }
    
    if (hasNumber(msg[msg.indexOf('번만')-1])){
        if (!msg.includes('연타')){
            msg = msg.replace('참석','연타 참석');
        }
    }
    
    if (msg.includes('빠질게')){
        getOutFromRoster(useRoster, sender, msg, replier);
    } else if (msg.includes('참석') || msg.includes('참가') || msg.includes('참여')){
        participateRoster(useRoster, msg, sender, replier);
    }
    //출석부 끝
    
    //레이드 알 제보 현황 시작 & 리서치 아닌 것
    if (msg.includes('남음') && msg.includes('분') && hasNumber(msg[msg.indexOf('분')-1])){
        //어디 교회 40분 남음
        //3시 몇분 어디 교회 제보 ->로 변경
        msg = raidRemainingConvert(msg);
    } else if (msg.includes('분수')){
        msg = msg.replace('분수','부부부븐수');
        if (msg.includes('남음') && msg.includes('분') && hasNumber(msg[msg.indexOf('분')-1])){
        //어디 교회 40분 남음
        //3시 몇분 어디 교회 제보 ->로 변경
        msg = raidRemainingConvert(msg);
        }
        msg = msg.replace('부부부븐수','분수');
    }
    
    
    msg = msg.replace('세븐일래븐','711'); msg = msg.replace('세븐일레븐','711'); 
    msg = msg.replace('새븐일레븐','711'); 
    msg = msg.replace('새븐일래븐','711'); msg = msg.replace('TWORLD','티월드'); 
    msg = msg.replace('Tworld','티월드'); 
    msg = msg.replace('T World','티월드'); msg = msg.replace('T world','티월드'); 

    msg = msg.replace('레이드 정보','현황');
    
    msg = msg.trim();
    
    

    roomNameForPrint = room;
    if (!room.includes('강남구 포켓몬고 레이드 제보 방')){
        if (msg.includes("현황") && msg.includes("전체")){
            roomNameForPrint = '전체';
            returnText = raidReportReturn('raidStatus', null, null);
        } else if (msg.includes("현황") && !msg.includes("리서치")){
            returnText = raidReportReturn(useRaidStatus, null, null);
            raidReportReturn("raidStatus", null, null);
        } else if (msg == "전체 제보 리셋"){
            returnText = '[강남구 전체] ' + raidReportReturn("raidStatus", null, "DELETE ALL");
        } else if (msg == "제보 리셋" || msg == "제보 리셋해줘"){
            returnText = raidReportReturn(useRaidStatus, null, "DELETE ALL");
        } else if (msg.includes("제보 변경:") || msg.includes("제보변경:")){
            returnText = raidReportChange(useRaidStatus,msg,null);
            raidReportChange('raidStatus',msg,null);
            msg = msg.replace("제보","")
        } else if ((msg.includes('삭제해줘') || msg.includes('제보삭제') || msg.includes('제보 삭제') || msg.includes('삭제 해줘') || msg.includes('오보') || msg.includes("끝났어") || msg.includes("만료")) && !msg.includes("리서치")){
            //여기가 가장 중요한 부분
            msg = msg.replace('제보삭제',''); msg = msg.replace('제보 삭제','');
            msg = msg.replace('시간만료',''); msg = msg.replace('끝났어',''); msg = msg.replace('만료','');
            msg = msg.replace('삭제해줘',''); msg = msg.replace('오보',''); 

            returnText = raidReportReturn(useRaidStatus,null,msg);
            raidReportReturn('raidStatus',null,msg);
            //replier.reply(msg + " 제보가 삭제 되었습니다.");        
        } if ((msg.includes("시") || msg.includes(":")) && msg.includes("제보") && !msg.includes("리서치")){
            if (msg.includes('1시') || msg.includes('2시') || msg.includes('3시') || msg.includes('4시') || msg.includes('5시') || msg.includes('6시') || msg.includes('7시') || msg.includes('8시') || msg.includes('9시') || msg.includes('10시') || msg.includes('11시') || msg.includes('12시') || msg.includes('1:') || msg.includes('2:') || msg.includes('3:') || msg.includes('4:') || msg.includes('5:') || msg.includes('6:') || msg.includes('7:') || msg.includes('8:') || msg.includes('9:') || msg.includes('10:') || msg.includes('11:') || msg.includes('12:')){
                //무식하지만 이렇게 하자...
                //여기서 제보가 많다면!?
                if (msg.includes('\n')){
                    //이거 이정도면 함수로 뺴야겠는데
                    //테스트는 내일!
                    var dummyDivide = msg.split('\n');
                    for (var i=0; i < dummyDivide.length; i++){
                        raidReportReturn(useRaidStatus, dummyDivide[i], null);
                        raidReportReturn('raidStatus', dummyDivide[i], null);
                    }
                    returnText = raidReportReturn(useRaidStatus, null, null);
                    raidReportReturn('raidStatus', null, null);
                } else {
                    returnText = raidReportReturn(useRaidStatus, msg, null);
                    raidReportReturn('raidStatus', msg, null);
                }
            }
        }
    } else {
        if (msg.includes("현황") && msg.includes("전체")){
            roomNameForPrint = '전체';
            returnText = raidReportReturn('raidStatus', null, null);

        } else if (msg.includes("현황") && !msg.includes("리서치")){
            returnText = raidReportReturn(useRaidStatus, null, null);
        } else if (msg == "제보 리셋" || msg == "제보 리셋해줘"){
            returnText = raidReportReturn(useRaidStatus, null, "DELETE ALL");
        } else if (msg.includes("제보 변경:") || msg.includes("제보변경:")){
            returnText = raidReportChange(useRaidStatus,msg,null);
            msg = msg.replace("제보","")
        } else if ((msg.includes('삭제해줘') || msg.includes('제보삭제') || msg.includes('제보 삭제') || msg.includes('삭제 해줘') || msg.includes('오보') || msg.includes("끝났어") || msg.includes("만료")) && !msg.includes("리서치")){
            //여기가 가장 중요한 부분
            msg = msg.replace('제보삭제',''); msg = msg.replace('제보 삭제','');
            msg = msg.replace('시간만료',''); msg = msg.replace('끝났어',''); msg = msg.replace('만료','');
            msg = msg.replace('삭제해줘',''); msg = msg.replace('오보',''); 

            returnText = raidReportReturn(useRaidStatus,null,msg);
            //replier.reply(msg + " 제보가 삭제 되었습니다.");        
        } if ((msg.includes("시") || msg.includes(":")) && msg.includes("제보") && !msg.includes("리서치")){
            if (msg.includes('1시') || msg.includes('2시') || msg.includes('3시') || msg.includes('4시') || msg.includes('5시') || msg.includes('6시') || msg.includes('7시') || msg.includes('8시') || msg.includes('9시') || msg.includes('10시') || msg.includes('11시') || msg.includes('12시') || msg.includes('1:') || msg.includes('2:') || msg.includes('3:') || msg.includes('4:') || msg.includes('5:') || msg.includes('6:') || msg.includes('7:') || msg.includes('8:') || msg.includes('9:') || msg.includes('10:') || msg.includes('11:') || msg.includes('12:')){
                //무식하지만 이렇게 하자...
                //여기서 제보가 많다면!?
                if (msg.includes('\n')){
                    //이거 이정도면 함수로 뺴야겠는데
                    //테스트는 내일!
                    var dummyDivide = msg.split('\n');
                    for (var i=0; i < dummyDivide.length; i++){
                        raidReportReturn(useRaidStatus, dummyDivide[i], null);
                    }
                    returnText = raidReportReturn(useRaidStatus, null, null);
                } else {
                    returnText = raidReportReturn(useRaidStatus, msg, null);
                }
            }
        }
    }
    
    

    //리서치 시작
    if (msg.includes("리서치") && msg.includes("제보")){
        msg = msg.replace("제보", ""); msg = msg.replace("리서치",""); msg = msg.trim();
        returnText = researchReturn(useResearch, msg);
    } else if (msg.includes('리서치') && (msg.includes('삭제해줘')) || msg.includes('오보') || msg.includes('삭제 해줘') || msg.includes('리서치 삭제')){
        returnText = deleteResearch(useResearch,msg);
    } else if (msg =="리서치 리셋" || msg == "리서치 리셋해줘"){
        returnText = raidReportReturn(useResearch, null, "DELETE ALL");
    } else if(msg.includes("리서치 목록") || (msg.includes('리서치') && msg.includes('현황'))){
        returnText = raidReportReturn(useResearch, null, null);
        msg = "끝났어!";
    } 
    
    if ((msg == '전부 리셋')){
        returnText = raidReportReturn(useRaidStatus, null, "DELETE ALL");
        returnText = raidReportReturn(useResearch, null, "DELETE ALL");
        returnText = rosterReset(useRoster);
        returnText = '리서치 목록, 제보, 출석부가 전부 리셋되었습니다.';
    }
    
    //끝
    

    
    if (returnText != "none"){
        replier.reply(returnText);
    }
}

