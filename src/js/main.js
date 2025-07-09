import Needle from "./modules/needle";

/*------------------------------------------------------------------------------------------------------------------------
Инициализиpуем 6 креативов
--------------------------------------------------------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", function () {
	new Needle("#creative-sber", {
		firm: "sber",
		aspect: "4/3",
	});
	new Needle("#creative-okko", {
		firm: "okko",
		aspect: "4/3",
	});
	new Needle("#creative-samolet", {
		firm: "samolet",
		aspect: "4/3",
	});
});

