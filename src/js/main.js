import Needle from "./modules/needle";

const needle = new Needle({
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
});
