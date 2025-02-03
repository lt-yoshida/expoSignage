let message = [];
const messageDiv = document.getElementById("message");
async function getEvents() {
	log("処理開始 ver:26");

	let dt = new Date();

	// URLSearchParamsオブジェクトを取得
	let timeParams = new URL(window.location.href).searchParams;
	const times = timeParams.get('time');
	const index = {
		1: [0, 1, 2, 3, 4],
		2: [5, 6, 7, 8, 9],
		3: [10, 11, 12, 13, 14],
		4: [15, 16, 17, 18, 19],
	}
	const enableIndex = times ? index[times] : index[1];

	// パラメータ
	log("パラメータ準備開始");
	let url = null;
	try {
		const tz = "Asia/Tokyo";
		let begin = dt.toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"}).replace(/\//g, '-').concat("T00:00:00");
		dt.setDate(dt.getDate() + 14)
		let end = dt.toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit", day: "2-digit"}).replace(/\//g, '-').concat("T23:59:59");
		const params = {
			tzMin: tz,
			timeMin: begin,
			tzMax: tz,
			timeMax: end
		};
		let searchParams = new URLSearchParams(params);
		url = 'https://dev4.jorte.com/calendar/contracted/expo/events/-/by-datetime?' + searchParams.toString();
		// url = 'http://localhost:9000/calendar/contracted/expo/events/-/by-datetime?' + searchParams.toString();
	} catch(e) {
		log(e);
	}
	log("パラメータ準備完了");

	try {
		const response = await fetch(url);
		const data = await response.json();
		const events = data.items;

		log("データ取得完了");

		let targetIndex = 0;
		log("データ反映開始");
		for (let i = 0; i < enableIndex.length; i++) {
			let eIndex = enableIndex[i];

			let event = events[eIndex];
			if (!event) {
				continue;
			}

			const titles = document.getElementsByClassName('title-' + targetIndex);
			for (let i = 0; i < titles.length; i++) {
				titles[i].textContent = event.title;
			}

			const titleEns = document.getElementsByClassName('title-en-' + targetIndex);
			for (let i = 0; i < titleEns.length; i++) {
				titleEns[i].textContent = event.misc.enEvent.title;
			}

			const imgs = document.getElementsByClassName('img-' + targetIndex);
			for (let i = 0; i < imgs.length; i++) {
				imgs[i].src = event.decoration.photo.uri;
			}

			const locs = document.getElementsByClassName('location-' + targetIndex);
			for (let i = 0; i < locs.length; i++) {
				locs[i].textContent = event.location;
			}

			const locEns = document.getElementsByClassName('location-en-' + targetIndex);
			for (let i = 0; i < locEns.length; i++) {
				locEns[i].textContent = event.misc.enEvent.location;
			}

			const sums = document.getElementsByClassName('summary-' + targetIndex);
			for (let i = 0; i < sums.length; i++) {
				sums[i].innerHTML = event.misc.summary;
			}

			const sumEns = document.getElementsByClassName('summary-en-' + targetIndex);
			for (let i = 0; i < sumEns.length; i++) {
				sumEns[i].textContent = event.misc.enEvent.misc.summary;
			}

			const thumbDT = document.getElementById('thumb-datetime-' + targetIndex);
			thumbDT.textContent = getDatetime(event);

			const thumbPre = document.getElementById('thumb-prefecture-' + targetIndex);
			thumbPre.textContent = getPrefecture(event);

			const mapSvg = document.getElementById('map-svg-' + targetIndex);
			mapSvg.src = getSvgNumber(event);
			

			targetIndex++;

		}
		log("データ反映終了");

		let slideIndex = 0;
		const slideInterval = 20000; // スライド間隔 (ms)

		let intervalId = setInterval(() => {
			slideIndex++;
			log("doSlide関数呼び出し : " + slideIndex + "回目");


			// スライド切り替え処理
			const thumbContents = document.getElementsByClassName("thumb-content");
			const mainContents = document.getElementsByClassName("main-content");
			if (thumbContents.length <= slideIndex) {
				log("スライド処理完了 : " + slideIndex + "回目");

				clearInterval(intervalId);
				return;
			}

			thumbContents[slideIndex - 1].classList.remove("swiper-slide-thumb-active");
			thumbContents[slideIndex].classList.add("swiper-slide-thumb-active");

			$(mainContents[slideIndex - 1]).fadeOut(200, function() {
				$(mainContents[slideIndex]).fadeIn(200);
			});

			log("スライド切替処理完了 : " + slideIndex);

		}, slideInterval);

	} catch (error) {
		console.error('エラーが発生しました:', error);
		log(error);
	}
}

function log(str) {
	message.push(str);
	messageDiv.innerHTML = message.join("<br>");
}

function getDatetime(event) {
	return event.begin.date.replace(/\//g, '-') + "～" + event.end.date.replace(/\//g, '-');
}

function getPrefecture(event) {

	const targetWord = '地域';

	const results = event.tags.find(function(item) {
		return item.indexOf(targetWord) >= 0;
	});
	const prefecture = results.split(":")[1];	

	let prefectureEn = "";
	switch (prefecture) {
		case "北海道"   : prefectureEn = "Hokkaido"; break;
		case "青森県"   : prefectureEn = "Aomori"; break;
		case "岩手県"   : prefectureEn = "Iwate"; break;
		case "宮城県"   : prefectureEn = "Miyagi"; break;
		case "秋田県"   : prefectureEn = "Akita"; break;
		case "山形県"   : prefectureEn = "Yamagata"; break;
		case "福島県"   : prefectureEn = "Fukushima"; break;
		case "茨城県"   : prefectureEn = "Ibaraki"; break;
		case "栃木県"   : prefectureEn = "Tochigi"; break;
		case "群馬県"   : prefectureEn = "Gunma"; break;
		case "埼玉県"   : prefectureEn = "Saitama"; break;
		case "千葉県"   : prefectureEn = "Chiba"; break;
		case "東京都"   : prefectureEn = "Tokyo"; break;
		case "神奈川県" : prefectureEn = "Kanagawa"; break;
		case "新潟県"   : prefectureEn = "Niigata"; break;
		case "富山県"   : prefectureEn = "Toyama"; break;
		case "石川県"   : prefectureEn = "Ishikawa"; break;
		case "福井県"   : prefectureEn = "Fukui"; break;
		case "山梨県"   : prefectureEn = "Yamanashi"; break;
		case "長野県"   : prefectureEn = "Nagano"; break;
		case "岐阜県"   : prefectureEn = "Gifu"; break;
		case "静岡県"   : prefectureEn = "Shizuoka"; break;
		case "愛知県"   : prefectureEn = "Aichi"; break;
		case "三重県"   : prefectureEn = "Mie"; break;
		case "滋賀県"   : prefectureEn = "Shiga"; break;
		case "京都府"   : prefectureEn = "Kyoto"; break;
		case "大阪府"   : prefectureEn = "Osaka"; break;
		case "兵庫県"   : prefectureEn = "Hyogo"; break;
		case "奈良県"   : prefectureEn = "Nara"; break;
		case "和歌山県" : prefectureEn = "Wakayama"; break;
		case "鳥取県"   : prefectureEn = "Tottori"; break;
		case "島根県"   : prefectureEn = "Shimane"; break;
		case "岡山県"   : prefectureEn = "Okayama"; break;
		case "広島県"   : prefectureEn = "Hiroshima"; break;
		case "山口県"   : prefectureEn = "Yamaguchi"; break;
		case "徳島県"   : prefectureEn = "Tokushima"; break;
		case "香川県"   : prefectureEn = "Kagawa"; break;
		case "愛媛県"   : prefectureEn = "Ehime"; break;
		case "高知県"   : prefectureEn = "Kochi"; break;
		case "福岡県"   : prefectureEn = "Fukuoka"; break;
		case "佐賀県"   : prefectureEn = "Saga"; break;
		case "長崎県"   : prefectureEn = "Nagasaki"; break;
		case "熊本県"   : prefectureEn = "Kumamoto"; break;
		case "大分県"   : prefectureEn = "Oita"; break;
		case "宮崎県"   : prefectureEn = "Miyazaki"; break;
		case "鹿児島県" : prefectureEn = "Kagoshima"; break;
		case "沖縄県"   : prefectureEn = "Okinawa"; break;
	}

	return prefecture + " / " + prefectureEn;
}

function getSvgNumber(event) {
	const targetWord = '地域';

	const results = event.tags.find(function(item) {
		return item.indexOf(targetWord) >= 0;
	});
	const prefecture = results.split(":")[1];	

	let prefectureNum = "";
	switch (prefecture) {
		case "北海道"   : prefectureNum = "01"; break;
		case "青森県"   : prefectureNum = "02"; break;
		case "岩手県"   : prefectureNum = "03"; break;
		case "宮城県"   : prefectureNum = "04"; break;
		case "秋田県"   : prefectureNum = "05"; break;
		case "山形県"   : prefectureNum = "06"; break;
		case "福島県"   : prefectureNum = "07"; break;
		case "茨城県"   : prefectureNum = "08"; break;
		case "栃木県"   : prefectureNum = "09"; break;
		case "群馬県"   : prefectureNum = "10"; break;
		case "埼玉県"   : prefectureNum = "11"; break;
		case "千葉県"   : prefectureNum = "12"; break;
		case "東京都"   : prefectureNum = "13"; break;
		case "神奈川県" : prefectureNum = "14"; break;
		case "新潟県"   : prefectureNum = "15"; break;
		case "富山県"   : prefectureNum = "16"; break;
		case "石川県"   : prefectureNum = "17"; break;
		case "福井県"   : prefectureNum = "18"; break;
		case "山梨県"   : prefectureNum = "19"; break;
		case "長野県"   : prefectureNum = "20"; break;
		case "岐阜県"   : prefectureNum = "21"; break;
		case "静岡県"   : prefectureNum = "22"; break;
		case "愛知県"   : prefectureNum = "23"; break;
		case "三重県"   : prefectureNum = "24"; break;
		case "滋賀県"   : prefectureNum = "25"; break;
		case "京都府"   : prefectureNum = "26"; break;
		case "大阪府"   : prefectureNum = "27"; break;
		case "兵庫県"   : prefectureNum = "28"; break;
		case "奈良県"   : prefectureNum = "29"; break;
		case "和歌山県" : prefectureNum = "30"; break;
		case "鳥取県"   : prefectureNum = "31"; break;
		case "島根県"   : prefectureNum = "32"; break;
		case "岡山県"   : prefectureNum = "33"; break;
		case "広島県"   : prefectureNum = "34"; break;
		case "山口県"   : prefectureNum = "35"; break;
		case "徳島県"   : prefectureNum = "36"; break;
		case "香川県"   : prefectureNum = "37"; break;
		case "愛媛県"   : prefectureNum = "38"; break;
		case "高知県"   : prefectureNum = "39"; break;
		case "福岡県"   : prefectureNum = "40"; break;
		case "佐賀県"   : prefectureNum = "41"; break;
		case "長崎県"   : prefectureNum = "42"; break;
		case "熊本県"   : prefectureNum = "43"; break;
		case "大分県"   : prefectureNum = "44"; break;
		case "宮崎県"   : prefectureNum = "45"; break;
		case "鹿児島県" : prefectureNum = "46"; break;
		case "沖縄県"   : prefectureNum = "47"; break;
	}
	return "img/prefecture/" + prefectureNum + ".svg";
}

getEvents();