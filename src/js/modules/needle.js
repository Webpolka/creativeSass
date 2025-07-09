export default class Needle {
	constructor(options) {
		const defaultConfig = {
			arrows: true,
			firm: "samolet",
			sber: {
				question: "Что важнее при оформлении автокредита?",
				answerLeft: "Ежемесячный платеж",
				answerRight: "Общая переплата",
				videoLink: "./vendor/video/sber.mp4",
				popupText: 'ООО "ХАВЕЙЛ МОТОР РУС", ИНН 7729763331, ID a-16835',
				logoLink: "https://sberauto.com/",
				landingLink: "https://sberauto.com/kredit-bez-pervogo-vznosa-sberavto",
			},
			okko: {
				question: "С кем предпочитаете смотреть фильмы?",
				answerLeft: "В одиночестве",
				answerRight: "В компании",
				videoLink: "./vendor/video/okko.mp4",
				popupText: 'ООО "OKKO интертеймент", ИНН 77999999999, ID a-99999',
				logoLink: "https://okko.tv/",
				landingLink: "https://okko.tv/",
			},
			samolet: {
				question: "Нужен ли риелтор при покупке квартиры?",
				answerLeft: "да, он может сэкономить время",
				answerRight: "нет, справляюсь самостоятельно",
				videoLink: "./vendor/video/samolet.mp4",
				popupText: 'ООО "САМОЛЕТ продакшен", ИНН 99999999999, ID a-11111',
				logoLink: "https://samolet.ru/",
				landingLink: "https://samolet.ru/flats/",
			},

			clickSound: "./vendor/audio/click.mp3",
		};
		this.options = Object.assign(defaultConfig, options);

		this.creative = document.getElementById("creative");
		this.createWidget();
		
		this.dial = document.querySelector("#dial");
		this.needle = document.getElementById("needle");
		
		this.dragging = false;

		this.createVideo();

		this.videoPlayer = document.getElementById("videoPlayer");
		this.videoContainer = document.getElementById("videoContainer");
		this.videoContainer.style.display = "none";

		if (this.options.clickSound) {
			this.clickSound = new Audio();
			this.clickSound.src = this.options.clickSound;
		}

		this.createPopup();
		this.infoBtn = document.getElementById("infoButton");
		this.infoClose = document.getElementById("infoClose");
		this.infoPopup = document.getElementById("infoPopup");

		this.arcThumb = document.getElementById("arcThumb");

		this.side = null;
		this.prevDeltaX = 0;
		this.canMove = true;
		this.needle.classList.add("swingingLeft");

		this.infoPopupListener();
		this.listener();

		this.optionsCorrector();

		this.localStorage = [];		
	}

	// Опционально
	optionsCorrector() {
		// Корректируем Стрелки
		const arrows = document.querySelector(".creative-taxo_arrows");
		if (!this.options.arrows) {
			arrows.classList.add("hidden");
		}

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
		const logo = document.querySelector(".creative-logo_link");
		correctGraphics(logo);
		// Корректируем Бегунок
		const thumb = document.getElementById("arcThumb");
		correctGraphics(thumb);
		// Корректируем Ярлычек
		const lab = document.getElementById("arcLabel");
		correctGraphics(lab);

		// Корректируем ВОПРОС и ОТВЕТЫ
		const question = document.querySelector(".creative-header_question p");
		const answerLeft = document.querySelector(".creative-answers_left p");
		const answerRight = document.querySelector(".creative-answers_right p");
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
	}

	// Прослушивание РЕКЛАМА
	infoPopupListener() {
		this.infoBtn.addEventListener("click", (e) => {
			this.infoPopup.classList.add("show");
			this.canMove = false;
		});

		this.infoClose.addEventListener("click", (e) => {
			this.infoPopup.classList.remove("show");
			this.canMove = true;
		});
	}

	// Прослушивание событий
	listener() {
		this.needle.addEventListener(
			"touchstart",
			(e) => {
				this.dragging = true;
				this.animeStart();
				// e.preventDefault();
			},
			{ passive: false }
		);

		this.needle.addEventListener(
			"touchmove",
			(e) => {
				if (!this.dragging) return;
				// берем первый палец
				const touch = e.touches[0];
				if (this.dragging && this.canMove) this.rotateNeedle(touch);
				e.preventDefault();
			},
			{ passive: false }
		);

		this.needle.addEventListener("touchend", (e) => {
			this.dragging = false;
			if (this.canMove) {
				this.animeEnd();
			}
		});

		this.needle.addEventListener("mousedown", (event) => {
			this.dragging = true;
			this.animeStart();
			this.rotateNeedle(event);
		});

		this.dial.addEventListener("mousemove", (event) => {
			if (this.dragging && this.canMove) this.rotateNeedle(event);
		});

		this.dial.addEventListener("mouseup", () => {
			this.dragging = false;
			if (this.canMove) {
				this.animeEnd();
			}
		});

		this.dial.addEventListener("click", (event) => {
			if (this.canMove) {
				this.needle.classList.remove("swingingLeft");
				this.needle.classList.remove("swingingRight");

				const value = this.getValueFromMouseEvent(event);
				this.updatevalue(value);
			}
		});

		// Когда видео заканчивается, скрываем контейнер
		this.videoPlayer.addEventListener("ended", () => {
			this.videoContainer.style.display = "none"; // Скрываем контейнер
			this.canMove = true;
		});
		// Опционально: скрываем контейнер, если пользователь кликнет вне видео
		this.videoContainer.addEventListener("click", (event) => {
			if (event.target === this.videoContainer) {
				this.videoPlayer.pause(); // Приостанавливаем видео
				this.videoPlayer.currentTime = 0; // Сбрасываем видео на начало
				this.videoContainer.style.display = "none";
				this.canMove = true;
			}
		});
	}
	// Начало энерционной анимации
	animeStart() {
		if (this.canMove) {
			this.dial.style.userSelect = "none";

			this.needle.classList.remove("swingingLeft");
			this.needle.classList.remove("swingingRight");
			this.needle.classList.remove("forwardLeft");
			this.needle.classList.remove("forwardRight");
		}
	}
	// Конец энерционной анимации
	animeEnd() {
		if (this.canMove) {
			this.dial.style.userSelect = "";

			setTimeout(() => {
				if (this.side == "left") {
					this.needle.classList.add("forwardLeft");
				}
				if (this.side == "right") {
					this.needle.classList.add("forwardRight");
				}
				this.canMove = false;
			}, 100);

			setTimeout(() => {
				this.needle.classList.remove("forwardLeft");
				this.needle.classList.remove("forwardRight");

				if (this.side == "right") {
					this.needle.classList.add("swingingRight");
				}
				if (this.side == "left") {
					this.needle.classList.add("swingingLeft");
				}
				// this.canMove = true;
			}, 1100);
		}
		this.openVideo();
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

		return angleDeg;
	}
	// Получаем угол пина при клике
	getValueFromMouseEvent(event) {
		const rect = this.dial.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.bottom;
		const deltaX = event.clientX - centerX;
		const deltaY = event.clientY - centerY;
		let angleRad = Math.atan2(-deltaY, deltaX); // Используем -deltaY, так как Y-ось в браузере инвертирована
		let angleDeg = angleRad * (180 / Math.PI);

		if (deltaX < 0) {
			if (deltaX < this.prevDeltaX) {
				this.side = "left";
				this.prevDeltaX = deltaX;
			} else {
				this.side = "right";
				this.prevDeltaX = deltaX;
			}
		}
		if (deltaX > 0) {
			if (deltaX > this.prevDeltaX) {
				this.side = "right";
				this.prevDeltaX = deltaX;
			} else {
				this.side = "left";
				this.prevDeltaX = deltaX;
			}
		}
		this.createStorageSimple();
		return angleDeg;
	}

	// Вращаем пин при перетаскивании
	rotateNeedle(event) {
		const angle = this.getAngleFromEvent(event, dial);
		const rotation = angle - 90;
		this.needle.style.setProperty("--base-angle", `${-rotation * 1.14}deg`);
		this.arcThumb.style.setProperty("--thumb-angle", `${-rotation * 1.1}deg`);
	}

	// Вращаем пин при клике
	updatevalue(value) {
		value = Math.max(0, Math.min(180, value));
		if (value < 12) {
			value = 12;
		}
		if (value > 168) {
			value = 168;
		}
		const rotation = value - 90;
		this.needle.style.setProperty("--base-angle", `${-rotation * 1.14}deg`);
		this.arcThumb.style.setProperty("--thumb-angle", `${-rotation * 1.1}deg`);
	}

	// Открытие видео
	openVideo() {
		this.clickSound ? this.clickSound.play() : "";

		setTimeout(() => {
			this.videoContainer.style.display = "flex"; // Показываем контейнер
			this.videoPlayer.play(); // Запускаем видео
			this.infoPopup.classList.remove("show");
		}, 2000);
	}

	// Создаем контейнер для видео
	createVideo() {
		if (this.options.firm == "sber") {
			this.videoLink = this.options.sber.videoLink;
		} else if (this.options.firm == "okko") {
			this.videoLink = this.options.okko.videoLink;
		} else if (this.options.firm == "samolet") {
			this.videoLink = this.options.samolet.videoLink;
		}
		let html = `
		<div id="videoContainer">
			<video id="videoPlayer" controls>
				<source src="${this.videoLink}" type="video/mp4" />
				Ваш браузер не поддерживает видео HTML5.
			</video>
		</div>`;

		document.body.insertAdjacentHTML("beforeend", html);
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
				<button class="info-popup_close" id="infoClose">
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

		document.body.insertAdjacentHTML("beforeend", html);
	}

	createWidget() {
		let logoLink;
		if (this.options.firm == "sber") {
			logoLink = this.options.sber.logoLink;
		} else if (this.options.firm == "okko") {
			logoLink = this.options.okko.logoLink;
		} else if (this.options.firm == "samolet") {
			logoLink = this.options.samolet.logoLink;
		}		
		let html = `
			<!-- Информационный текст -->
		<div class="creative-header">
			<div class="creative-header_pulse"><span>Живое голосование</span><span class="pulse-icon"></span></div>

			<div class="creative-header_question">
				<p></p>
			</div>
		</div>

		<!-- Тахометр -->
		<div class="creative-taxo">
			<div class="creative-taxo_arc" id="dial">
				<div class="creative-taxo_arrows"></div>
				<div class="creative-taxo_needle" id="needle"></div>
				<div class="creative-taxo_label" id="arcLabel"></div>
				<div class="creative-taxo_circle"></div>
				<div class="creative-taxo_thumb" id="arcThumb"></div>
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

		<!-- Лого -->
		<div class="creative-logo">
			<a href="${logoLink}" class="creative-logo_link"></a>
		</div>

		<!-- Подвал -->
		<div class="creative-footer">			
		
			<a href="https://programmatica.com/" class="creative-footer_programmatica">
				<img class="img-responsive" src="./images/programmatica.svg" alt="Логотип programmatica">
			</a>
			<button id="infoButton" class="creative-footer_advertising">
				<span class="btn-info">!</span>
				<span>Реклама</span>
			</button>
		</div>`;		
		
		this.creative.insertAdjacentHTML("beforeend", html);
	}

	// Функция формирования базы голосов для двух вариантов (можно будет переписать под свои нужды)
	createStorageSimple() {
		const left = document.querySelector(".creative-answers_left p").textContent.trim();
		const right = document.querySelector(".creative-answers_right p").textContent.trim();
		this.localStorage.push(this.side == "left" ? left : right);
		console.log("Массив ответов :", this.localStorage);
	}
}
