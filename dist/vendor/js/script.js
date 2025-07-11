class Needle {
	constructor(elem, options) {
		const defaultConfig = {
			firm: "samolet",
			aspect: "4/3",
			closeVideoDelayButtonShow: 5000,

			sber: {
				question: "Что важнее при оформлении автокредита?",
				answerLeft: "Ежемесячный платеж",
				answerRight: "Общая переплата",
				segment0Link: "./images/sber/parts/part-0.svg",
				segment1Link: "./images/sber/parts/part-1.svg",
				segment2Link: "./images/sber/parts/part-2.svg",
				segment3Link: "./images/sber/parts/part-3.svg",
				segment4Link: "./images/sber/parts/part-4.svg",
				segment5Link: "./images/sber/parts/part-5.svg",

				videoStoragePoster: "./images/sber/sber-banner.png",
				videoStorageLink: "https://storage.yandexcloud.net/creo/Sber/sber%20auto.mp4",

				popupText: 'ООО "CБЕР маркет", ИНН 0000000000, ID a-000000',
				logoLink: "https://sberauto.com/",
				landingLink: "https://sberauto.com/kredit-bez-pervogo-vznosa-sberavto",
			},
			okko: {
				question: "С кем предпочитаете смотреть фильмы?",
				answerLeft: "В одиночестве",
				answerRight: "В компании",
				segment0Link: "./images/okko/parts/part-0.svg",
				segment1Link: "./images/okko/parts/part-1.svg",
				segment2Link: "./images/okko/parts/part-2.svg",
				segment3Link: "./images/okko/parts/part-3.svg",
				segment4Link: "./images/okko/parts/part-4.svg",
				segment5Link: "./images/okko/parts/part-5.svg",

				videoStoragePoster: "./images/sber/sber-banner.png",
				videoStorageLink:
					"https://storage.yandexcloud.net/creo/okko/%D0%9C%D0%98%D0%A0%2C%20%D0%9A%D0%9E%D0%A2%D0%9E%D0%A0%D0%AB%D0%99%20%D0%AF%20%D0%A1%D0%9C%D0%9E%D0%A2%D0%A0%D0%AE%20_%20Okko.mp4",

				popupText: 'ООО "OKKO интертеймент", ИНН 77999999999, ID a-99999',
				logoLink: "https://okko.tv/",
				landingLink: "https://okko.tv/",
			},
			samolet: {
				question: "Нужен ли риелтор при покупке квартиры?",
				answerLeft: "да, он может сэкономить время",
				answerRight: "нет, справляюсь самостоятельно",
				segment0Link: "./images/samolet/parts/part-0.svg",
				segment1Link: "./images/samolet/parts/part-1.svg",
				segment2Link: "./images/samolet/parts/part-2.svg",
				segment3Link: "./images/samolet/parts/part-3.svg",
				segment4Link: "./images/samolet/parts/part-4.svg",
				segment5Link: "./images/samolet/parts/part-5.svg",

				videoStoragePoster: "./images/sber/sber-banner.png",
				videoStorageLink: "https://storage.yandexcloud.net/creo/Samolet/_%D0%9C%D0%B5%D0%BD%D0%B5%D0%B4%D0%B6%D0%B5%D1%80.mp4",

				popupText: 'ООО "САМОЛЕТ продакшен", ИНН 99999999999, ID a-11111',
				logoLink: "https://samolet.ru/",
				landingLink: "https://samolet.ru/flats/",
			},
			clickSound: "./vendor/audio/click.mp3",
		};
		this.options = Object.assign(defaultConfig, options);

		this.creative = document.querySelector(elem);
		this.createWidget();

		this.creative.style.userSelect = "none";

		this.dial = this.creative.querySelector(".dial");
		this.needle = this.creative.querySelector(".needle");

		this.dragging = false;

		this.videoContainer;
		this.videoPlayer;

		if (this.options.clickSound) {
			this.clickSound = new Audio();
			this.clickSound.src = this.options.clickSound;
		}

		this.infoPopup;
		this.infoClose;
		this.infoBtn = this.creative.querySelector(".infoButton");

		this.arrows = this.creative.querySelector(".creative-taxo_arrows");

		this.touchpad = this.creative.querySelector(".creative-taxo_touchpad");

		this.arcThumb = this.creative.querySelector(".arcThumb");
		this.thumb = this.creative.querySelector("#thumbElement");
		this.arcLabel = this.creative.querySelector(".arcLabel");
		this.segments = this.creative.querySelector(".segments");

		this.side = null;
		this.canMove = true;
		this.percent = 0;
		this.prevDeltaX = 0;
		this.angle;
		this.touchMoved = false;

		this.needle.classList.add("swingingLeft");

		this.infoPopupListener();
		this.listener();

		this.optionsCorrector();

		this.viTimer;
		this.txtTimer;

		// Привязываем контекст this к методу
		this.onResize = this.onResize.bind(this);

		// Слушаем resize
		window.addEventListener("resize", this.onResize);

		// Вызовем сразу при инициализации
		this.onResize();
	}
	onResize() {
		// Общие
		this.containerQueries(".creative-header_pulse", "font-size", 12, 4, 40);
		this.containerQueries(".creative-header_pulse .pulse-icon", "width", 25, 10, 73);
		this.containerQueries(".creative-header_question", "font-size", 11, 5, 50);
		if (this.options.firm == "sber") {
			this.containerQueries(".creative-header_question.sber-percent", "font-size", 20, 5, 60);
		}
		if (this.options.firm == "okko") {
			this.containerQueries(".creative-header_question.okko-percent", "font-size", 20, 5, 60);
		}
		if (this.options.firm == "samolet") {
			this.containerQueries(".creative-header_question.samolet-percent", "font-size", 20, 5, 60);
		}

		// Если 4/3
		if (this.options.aspect == "4/3") {
			this.containerQueries(".creative-tile", "padding-inline", 12, 5.2, 65);
			this.containerQueries(".creative-tile", "padding-top", 10, 3.5, 50);
			this.containerQueries(".creative-tile", "padding-bottom", 3, 2, 20);

			this.containerQueries(".creative-taxo", "margin-top", 5, 1, 75);
			this.containerQueries(".creative-taxo_arc", "max-width", 165, 57, 750);
			this.containerQueries(".creative-taxo_arc", "margin-bottom", 2, 1, 30);

			this.containerQueries(".creative-answers", "margin-top", 2, 1, 30);
			this.containerQueries(".creative-answers", "margin-bottom", 5, 3, 50);
			this.containerQueries(".creative-answers_left", "font-size", 11, 3.5, 40);
			this.containerQueries(".creative-answers_right", "font-size", 11, 3.5, 40);

			this.containerQueries(".creative-logo", "margin-bottom", 2, 1.5, 50);
			if (this.options.firm == "sber") {
				this.containerQueries(".creative-logo_link.sber", "max-width", 68, 20, 252);
			}
			if (this.options.firm == "okko") {
				this.containerQueries(".creative-logo_link.okko", "max-width", 46, 16, 177);
			}
			if (this.options.firm == "samolet") {
				this.containerQueries(".creative-logo_link.samolet", "max-width", 80, 26, 271);
			}
			this.containerQueries(".creative-footer", "padding-top", 6, 2, 22);
			this.containerQueries(".creative-footer_programmatica", "width", 175, 42, 485);
			this.containerQueries(".creative-footer_advertising span", "font-size", 12, 2.2, 25);
			this.containerQueries(".creative-footer_advertising .btn-info", "width", 15, 3, 32);
		}

		// Если 16/9
		if (this.options.aspect == "16/9") {
			this.containerQueries(".creative-tile", "padding-inline", 12, 5.2, 65);
			this.containerQueries(".creative-tile", "padding-top", 2, 0.5, 50);
			this.containerQueries(".creative-tile", "padding-bottom", 3, 2, 20);

			this.containerQueries(".creative-taxo", "margin-top", 5, 1, 75);
			this.containerQueries(".creative-taxo_arc", "max-width", 130, 46, 950);
			this.containerQueries(".creative-taxo_arc", "margin-bottom", 2, 1, 30);

			this.containerQueries(".creative-answers", "margin-top", 2, 1, 30);
			this.containerQueries(".creative-answers", "margin-bottom", 2, 1.2, 50);
			this.containerQueries(".creative-answers_left", "font-size", 8, 2.5, 40);
			this.containerQueries(".creative-answers_right", "font-size", 8, 2.5, 40);

			this.containerQueries(".creative-logo", "margin-bottom", 2, 1, 50);
			if (this.options.firm == "sber") {
				this.containerQueries(".creative-logo_link.sber", "max-width", 45, 15, 252);
			}
			if (this.options.firm == "okko") {
				this.containerQueries(".creative-logo_link.okko", "max-width", 29, 16, 177);
			}
			if (this.options.firm == "samolet") {
				this.containerQueries(".creative-logo_link.samolet", "max-width", 70, 23, 271);
			}
			this.containerQueries(".creative-footer", "padding-top", 2, 1, 22);
			this.containerQueries(".creative-footer_programmatica", "width", 150, 42, 485);
			this.containerQueries(".creative-footer_advertising span", "font-size", 9, 1.5, 25);
			this.containerQueries(".creative-footer_advertising .btn-info", "width", 10, 2, 32);
		}
	}
	containerQueries(element, styling, min, cqw, max) {
		let parent = this.creative.querySelector(".creative-tile");
		let eles = this.creative.querySelectorAll(element);
		let width = parent.offsetWidth;
		let value = Math.max(min, Math.min((width / 100) * cqw, max));

		let maxContWidth;
		if (this.options.aspect == "4/3") {
			maxContWidth = 1280;
		}
		if (this.options.aspect == "16/9") {
			maxContWidth = 1920;
		}

		if (width <= 280) {
			value = min;
		}
		if (width >= maxContWidth) {
			value = max;
		}
		eles.forEach((ele) => {
			ele.style.setProperty(styling, value + "px");
		});
	}

	// Настройки
	optionsCorrector() {
		let opt = this.options;
		let correctGraphics = (el) => {
			if (opt.firm == "sber") {
				el.classList.add("sber");
			} else if (this.options.firm == "okko") {
				el.classList.add("okko");
			} else if (this.options.firm == "samolet") {
				el.classList.add("samolet");
			}
		};
		// Корректируем Логотип
		const logo = this.creative.querySelector(".creative-logo_link");
		correctGraphics(logo);
		// Корректируем Бегунок
		const thumb = this.creative.querySelector(".arcThumb");
		correctGraphics(thumb);
		// Корректируем Ярлычек
		const lab = this.creative.querySelector(".arcLabel");
		correctGraphics(lab);

		// Корректируем ВОПРОС и ОТВЕТЫ
		const question = this.creative.querySelector(".creative-header_question p");
		const answerLeft = this.creative.querySelector(".creative-answers_left p");
		const answerRight = this.creative.querySelector(".creative-answers_right p");
		if (this.options.firm == "sber") {
			question.textContent = this.options.sber.question;
			answerLeft.textContent = this.options.sber.answerLeft;
			answerRight.textContent = this.options.sber.answerRight;
		} else if (this.options.firm == "okko") {
			question.textContent = this.options.okko.question;
			answerLeft.textContent = this.options.okko.answerLeft;
			answerRight.textContent = this.options.okko.answerRight;
		} else if (this.options.firm == "samolet") {
			question.textContent = this.options.samolet.question;
			answerLeft.textContent = this.options.samolet.answerLeft;
			answerRight.textContent = this.options.samolet.answerRight;
		}

		if (this.options.aspect == "16/9") {
			this.creative.classList.add("aspect169");
		}
		if (this.options.aspect == "4/3") {
			this.creative.classList.add("aspect43");
		}
	}

	// Прослушивание РЕКЛАМА
	infoPopupListener() {
		this.infoBtn.addEventListener("click", (e) => {
			this.openPopup();
		});
	}

	openPopup() {
		this.createPopup();
		this.infoPopup = document.getElementById("infoPopup");
		this.infoClose = this.infoPopup.querySelector(".infoClose");
		this.infoPopup.classList.add("show");

		this.infoClose.addEventListener("click", (e) => {
			this.infoPopup.classList.remove("show");
			this.removePopup();
		});
	}

	removePopup() {
		this.infoPopup && this.infoPopup.remove();
	}

	// Прослушивание событий
	listener() {
		this.thumb.addEventListener(
			"touchstart",
			(e) => {
				this.dragging = true;
			},
			{ passive: false }
		);

		this.thumb.addEventListener(
			"touchmove",
			(e) => {
				if (!this.dragging) return;
				// берем первый палец
				const touch = e.touches[0];
				if (this.dragging && this.canMove) {
					this.rotatePin(touch);
					this.touchMoved = true;
				}
				e.preventDefault();
			},
			{ passive: false }
		);

		this.thumb.addEventListener("touchend", (e) => {
			if (this.canMove && this.dragging && this.touchMoved) {
				this.clickSound ? this.clickSound.play() : "";
				this.animeStart();

				setTimeout(() => {
					this.animeEnd();
				}, 0);
			}
			this.dragging = false;
		});

		window.addEventListener("mouseup", (event) => {
			if (event.target != this.arcLabel) {
				if (this.canMove && this.dragging) {
					this.clickSound ? this.clickSound.play() : "";
					this.animeStart();

					setTimeout(() => {
						this.animeEnd();
					}, 0);
				}
				this.dragging = false;
			}
		});

		window.addEventListener("mousemove", (event) => {
			if (event.target != this.arcLabel) {
				if (this.dragging && this.canMove) {
					this.rotatePin(event);
				}
			}
		});

		this.thumb.addEventListener("mousedown", (event) => {
			if (event.target != this.arcLabel) {
				this.dragging = true;
			}
		});

		this.dial.addEventListener("click", (event) => {
			if (event.target != this.arcLabel) {
				if (this.canMove) {
					this.clickSound ? this.clickSound.play() : "";
					this.animeStart();
					this.rotatePin(event);

					setTimeout(() => {
						this.animeEnd();
					}, 0);
				}
			}
		});
	}
	// Начало энерционной анимации
	animeStart() {
		if (this.canMove) {
			this.needle.classList.remove("swingingLeft");
			this.needle.classList.remove("swingingRight");
		}
	}
	// Конец энерционной анимации
	animeEnd() {
		this.rotateNeedle(this.angle);
		if (this.canMove) {
			this.arcThumb.classList.add("hide");

			this.segments.classList.add("show");

			this.arrows.classList.add("hide");

			setTimeout(() => {
				if (this.side == "left") {
					this.needle.classList.add("forwardLeft");
				}
				if (this.side == "right") {
					this.needle.classList.add("forwardRight");
				}
				this.canMove = false;

				this.showPercentText(this.percent);
			}, 250);

			setTimeout(() => {
				this.needle.classList.remove("forwardLeft");
				this.needle.classList.remove("forwardRight");
			}, 1250);
		}
		clearTimeout(this.viTimer);
		this.viTimer = setTimeout(() => {
			this.openVideo();
		}, 2000);
	}

	// Показываем нужный сегмент
	updateSegment(angle) {
		const seg0 = this.creative.querySelector(".segment-0");
		const seg1 = this.creative.querySelector(".segment-1");
		const seg2 = this.creative.querySelector(".segment-2");
		const seg3 = this.creative.querySelector(".segment-3");
		const seg4 = this.creative.querySelector(".segment-4");
		const seg5 = this.creative.querySelector(".segment-5");
		const all = [seg0, seg1, seg2, seg3, seg4, seg5];

		function hideOther(segment) {
			all.forEach((s) => {
				if (s !== segment) {
					s.classList.add("hidden");
				}
				segment.classList.remove("hidden");
			});
		}
		if (angle > 144 && angle <= 180) {
			hideOther(seg1);
			this.percent = 2;
		}
		if (angle > 111 && angle <= 144) {
			hideOther(seg2);
			this.percent = 70;
		}
		if (angle > 69 && angle <= 111) {
			hideOther(seg3);
			this.percent = 6;
		}
		if (angle > 36 && angle <= 69) {
			hideOther(seg4);
			this.percent = 10;
		}
		if (angle > 0 && angle <= 36) {
			hideOther(seg5);
			this.percent = 12;
		}
		if (angle == "undefined") {
			hideOther(seg0);
			this.percent = 0;
		}
	}

	// Показываем выбранные проценты в тексте
	showPercentText(percent) {
		if (percent != 0) {
			const text = this.creative.querySelector(".creative-header_question p");
			let percentClass;

			if (this.options.firm == "sber") {
				percentClass = "sber-percent";
			}
			if (this.options.firm == "okko") {
				percentClass = "okko-percent";
			}
			if (this.options.firm == "samolet") {
				percentClass = "samolet-percent";
			}

			clearTimeout(this.txtTimer);
			text.classList.add("hide-show");
			this.txtTimer = setTimeout(() => {
				text.classList.remove("hide-show");
			}, 750);
			text.innerHTML = `<span class="${percentClass}">${percent}%</span> пользователей думают также`;
		}
	}
	// Получаем угол при перетаскивании пина
	getAngleFromEvent(event, elem) {
		const rect = elem.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.bottom; // Вращаем от нижней точки

		let dx = event.clientX - cx;
		let dy = event.clientY - cy;

		let angleRad = Math.atan2(-dy, dx);
		if (dx < 0 && angleRad < 0) {
			angleRad = Math.PI;
		}
		let angleDeg = angleRad * (180 / Math.PI);
		angleDeg = Math.max(12, Math.min(168, angleDeg));

		if (dx < 0) {
			if (dx < this.prevDeltaX) {
				this.side = "left";
				this.prevDeltaX = dx;
			} else if (dx > this.prevDeltaX) {
				this.side = "right";
				this.prevDeltaX = dx;
			}
		}
		if (dx > 0) {
			if (dx > this.prevDeltaX) {
				this.side = "right";
				this.prevDeltaX = dx;
			} else if (dx < this.prevDeltaX) {
				this.side = "left";
				this.prevDeltaX = dx;
			}
		}

		return angleDeg;
	}

	// Вращаем уазатель
	rotateNeedle(angle) {
		angle = Math.max(0, Math.min(180, angle));
		if (angle < 12) {
			angle = 12;
		}
		if (angle > 168) {
			angle = 168;
		}
		const rotation = angle - 90;
		this.needle.style.setProperty("--base-angle", `${-rotation}deg`);
		this.updateSegment(angle);
	}

	// Вращаем бегунок
	rotatePin(event) {
		const angle = this.getAngleFromEvent(event, this.dial);
		const rotation = angle - 90;
		this.arcThumb.style.setProperty("--thumb-angle", `${-rotation * 1.1}deg`);
		this.angle = angle;
	}

	openVideo() {
		this.openBrowserVideo();
	}

	// Открытие видео в HTML5
	openBrowserVideo() {
		this.createBrowserVideo();
		this.videoContainer = document.getElementById("videoContainer");
		this.browserPlayer = this.videoContainer.querySelector("#browser-player");
		this.videoCloseButton = this.videoContainer.querySelector(".videoCloseButton");

		this.videoCloseButton.addEventListener("click", (e) => {
			this.removeVideo();
		});

		let closeVideoDelay = this.options.closeVideoDelayButtonShow;
		let videoCloseButton = this.videoCloseButton;

		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

		const video = this.browserPlayer;

		if (!isSafari) {
			video.muted = false;
			console.log('NO SAFARI');			
		}
		
		if(isSafari){
			console.log('IS SAFARI');
		}

		// Событие окончания воспроизведения
		video.addEventListener("ended", function () {
			console.log("Видео закончилось!");
			let ct = document.querySelector("#videoContainer");
			ct && ct.remove();
		});

		let hasActionFired = false;
		// Флаг, чтобы действие выполнялось один раз
		video.addEventListener("timeupdate", function () {
			if (!hasActionFired && video.currentTime >= closeVideoDelay / 1000) {
				videoCloseButton.classList.add("show");
				console.log("Прошла задержка");
				hasActionFired = true;
				// Сработало один раз
			}
		});
		// Сброс флага при перемотке назад (например, пользователь возвращается к началу)
		video.addEventListener("seeked", function () {
			if (video.currentTime < closeVideoDelay / 1000) {
				hasActionFired = false;
			}
		});
	}

	// Создаем контейнер для HTML5 видео
	createBrowserVideo() {
		let videoLink, landingLink, videoPoster;
		if (this.options.firm == "sber") {
			videoLink = this.options.sber.videoStorageLink;
			landingLink = this.options.sber.landingLink;
			videoPoster = this.options.sber.videoStoragePoster;
		} else if (this.options.firm == "okko") {
			videoLink = this.options.okko.videoStorageLink;
			landingLink = this.options.okko.landingLink;
			videoPoster = this.options.okko.videoStoragePoster;
		} else if (this.options.firm == "samolet") {
			videoLink = this.options.samolet.videoStorageLink;
			landingLink = this.options.samolet.landingLink;
			videoPoster = this.options.samolet.videoStoragePoster;
		}
		let html = `
		<div id="videoContainer">	
		
		<video 
		class="videoPlayerClass" 
		id="browser-player" 
		muted 
		autoplay 
		playsinline 
		preload="auto" 
		poster="${videoPoster}" 
		controls
		>
  			<source 
				src="${videoLink}" 				
				type="video/mp4"
			> 
   			Ваш браузер не поддерживает тег video.
   		</video>

		<a href="${landingLink}" target="_blank" class="linkLayer"></a>					
		<div class="blacklay"></div>
		
			<button class="videoCloseButton">
					<svg fill="#000000" width="64px" height="64px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"/> </g>
					</svg>
			</button>			
		</div>`;

		const video = document.querySelector("#videoContainer");
		if (!video) {
			const placement = this.creative.querySelector(".creative-tile");
			placement.insertAdjacentHTML("beforeend", html);
		}
	}
	removeVideo() {
		this.videoContainer && this.videoContainer.remove();
	}

	// Создаем информационный контейнер
	createPopup() {
		if (this.options.firm == "sber") {
			this.popupText = this.options.sber.popupText;
		} else if (this.options.firm == "okko") {
			this.popupText = this.options.okko.popupText;
		} else if (this.options.firm == "samolet") {
			this.popupText = this.options.samolet.popupText;
		}
		let html = `
		<div class="info-popup" id="infoPopup">
			<div class="info-popup_inner">
				<button class="info-popup_close infoClose">
					<svg fill="#000000" width="64px" height="64px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
						<g id="SVGRepo_bgCarrier" stroke-width="0"/>
						<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="SVGRepo_iconCarrier"> <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"/> </g>
					</svg>
				</button>
				<div class="info-popup_content">
					<p>${this.popupText}</p>
				</div>
			</div>
		</div>
		`;

		const pop = document.querySelector("#infoPopup");
		if (!pop) {
			document.body.insertAdjacentHTML("beforeend", html);
		}
	}

	createWidget() {
		let logoLink, landingLink;
		let segment0Link, segment1Link, segment2Link, segment3Link, segment4Link, segment5Link;

		if (this.options.firm == "sber") {
			logoLink = this.options.sber.logoLink;
			landingLink = this.options.sber.landingLink;
			segment0Link = this.options.sber.segment0Link;
			segment1Link = this.options.sber.segment1Link;
			segment2Link = this.options.sber.segment2Link;
			segment3Link = this.options.sber.segment3Link;
			segment4Link = this.options.sber.segment4Link;
			segment5Link = this.options.sber.segment5Link;
		} else if (this.options.firm == "okko") {
			logoLink = this.options.okko.logoLink;
			landingLink = this.options.okko.landingLink;
			segment0Link = this.options.okko.segment0Link;
			segment1Link = this.options.okko.segment1Link;
			segment2Link = this.options.okko.segment2Link;
			segment3Link = this.options.okko.segment3Link;
			segment4Link = this.options.okko.segment4Link;
			segment5Link = this.options.okko.segment5Link;
		} else if (this.options.firm == "samolet") {
			logoLink = this.options.samolet.logoLink;
			landingLink = this.options.samolet.landingLink;
			segment0Link = this.options.samolet.segment0Link;
			segment1Link = this.options.samolet.segment1Link;
			segment2Link = this.options.samolet.segment2Link;
			segment3Link = this.options.samolet.segment3Link;
			segment4Link = this.options.samolet.segment4Link;
			segment5Link = this.options.samolet.segment5Link;
		}
		let html = `
		<div class="creative-tile">
			<!-- Информационный текст -->
        <div class="creative-header-out">
		<div class="creative-header">
			<div class="creative-header_pulse"><span>Живое голосование</span><span class="pulse-icon"></span></div>

			<div class="creative-header_question">
				<p></p>
			</div>
		</div>
		</div>

		<div class='flex-box'>
		<!-- Тахометр -->
		<div class="creative-taxo">
			<div class="creative-taxo_arc dial">			   
				<div class="creative-taxo_circle"></div>	
				<div class="creative-taxo_touchpad"></div>
				<div class="creative-taxo_arrows"></div>
				<div class="creative-taxo_needle needle"></div>
				<a href="${landingLink}" target="_blank" class="creative-taxo_label arcLabel"></a>
														
				<div class="creative-taxo_segments segments">
					<div class="creative-taxo_segment segment-0">
						<img class="img-responsive" src="${segment0Link}" alt="0%"/>
					</div>
					<div class="creative-taxo_segment segment-1">
						<img class="img-responsive" src="${segment1Link}" alt="2%"/>
					</div>
					<div class="creative-taxo_segment segment-2">
						<img class="img-responsive" src="${segment2Link}" alt="70%"/>
					</div>
					<div class="creative-taxo_segment segment-3">
						<img class="img-responsive" src="${segment3Link}" alt="6%"/>
					</div>
					<div class="creative-taxo_segment segment-4">
						<img class="img-responsive" src="${segment4Link}" alt="10%"/>
					</div>
					<div class="creative-taxo_segment segment-5">
						<img class="img-responsive" src="${segment5Link}" alt="12%"/>
					</div>
				</div>
               
				<div class="creative-taxo_thumb-parent">
				<div class="creative-taxo_thumb arcThumb">
				    <span class="creative-taxo_thumb-element" id="thumbElement"></span>
				</div>	
				</div>
			</div>
		</div>

		<!-- Стороны -->
		<div class="creative-answers">
			<div class="creative-answers_left">
				<p></p>
			</div>
			<div class="creative-answers_right">
				<p></p>
			</div>
		</div>

		<div>
		<!-- Лого -->
		<div class="creative-logo">
			<a target="_blank" href="${logoLink}" class="creative-logo_link"></a>
		</div>

		<!-- Подвал -->
		<div class="creative-footer">			
		
			<a target="_blank" href="https://programmatica.com/" class="creative-footer_programmatica">
				<img class="img-responsive" src="./images/programmatica.svg" alt="Логотип programmatica">
			</a>
			<button class="creative-footer_advertising infoButton">
				<span class="btn-info">!</span>
				<span>Реклама</span>
			</button>
		</div>
		</div>
		</div>
		</div>`;

		this.creative.insertAdjacentHTML("beforeend", html);
	}

	// Записываем ГОЛОС в LocalStorage
	createStorage() {
		const left = this.creative.querySelector(".creative-answers_left p").textContent.trim();
		const right = this.creative.querySelector(".creative-answers_right p").textContent.trim();

		localStorage.setItem("voice", this.side == "left" ? left : right);
		console.log(localStorage.getItem("voice"), ' - сохранёно в LocalStorage по ключу "voice" !');
	}
}
/*-----------------------------------------------------------------------------------------------------------
Инициализация
-------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
	const crSber = document.querySelector("#creative-sber");
	const crOkko = document.querySelector("#creative-okko");
	const crSamo = document.querySelector("#creative-samolet");

	crSber &&
		new Needle("#creative-sber", {
			firm: "sber",
			aspect: "4/3",
		});
	crSamo &&
		new Needle("#creative-samolet", {
			firm: "samolet",
			aspect: "4/3",
		});
	crOkko &&
		new Needle("#creative-okko", {
			firm: "okko",
			aspect: "4/3",
		});
});
