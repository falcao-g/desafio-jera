let pomodoroTime = 25 * 60
let pauseTime = 5 * 60
let longPauseTime = 10 * 60
let time = pomodoroTime
let interval
let pomodoros = 0
let isPaused = true
let state = "pomodoro"
let intervals = 4
let autoStart = false
const notification = new Audio("./src/sounds/notification.mp3")
Notification.requestPermission()

const minutesSpan = document.getElementById("minutes")
const secondsSpan = document.getElementById("seconds")
const intervalButton = document.getElementById("interval-button")
const longIntervalButton = document.getElementById("long-interval-button")
const configButton = document.getElementById("config")
const pauseButton = document.getElementById("pause-button")
const pomodoroButton = document.getElementById("pomodoro-button")
const pomodorosSpan = document.getElementById("pomodoros")
const configContainer = document.getElementById("config-container")
const configClose = document.getElementById("config-close")
const pomodoroInput = document.getElementById("pomodoroInput")
const pauseInput = document.getElementById("pauseInput")
const longPauseInput = document.getElementById("longPauseInput")
const intervalsInput = document.getElementById("intervalsInput")
const timerAutoButton = document.getElementById("timerAutoButton")
const prettyButton = document.getElementById("pretty-button")

function formatTime(time) {
	const minutes = Math.floor(time / 60)
	const seconds = time % 60
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`
}

function highlightButton() {
	pomodoroButton.classList.remove("highlight")
	intervalButton.classList.remove("highlight")
	longIntervalButton.classList.remove("highlight")
	if (state === "pomodoro") {
		pomodoroButton.classList.add("highlight")
	} else if (state === "pause") {
		intervalButton.classList.add("highlight")
	} else {
		longIntervalButton.classList.add("highlight")
	}
}

function startTimer() {
	interval = setInterval(() => {
		if (!isPaused) {
			time--
			if (time < 0) {
				notification.play()
				setTimeout(() => {}, 1000)

				if (state === "pomodoro") {
					pomodoros++
					pomodorosSpan.textContent = pomodoros

					if (pomodoros % intervals === 0) {
						if (Notification.permission === "granted") {
							new Notification("Hora da pausa!", {
								body: `Você fez ${intervals} pomodoros, é recomendado que você faça uma pausa longa agora`,
							})
						}
						state = "longpause"
					} else {
						if (Notification.permission === "granted") {
							new Notification("Hora da pausa!")
						}
						state = "pause"
					}
				} else {
					if (Notification.permission === "granted") {
						new Notification("Hora de focar!")
					}
					state = "pomodoro"
				}

				if (!autoStart) {
					pauseButton.click()
				}

				reset()
			}

			if (state === "pomodoro") {
				document.title = `${formatTime(time).split(":")[0]}:${
					formatTime(time).split(":")[1]
				} - Hora de focar!`
			} else {
				document.title = `${formatTime(time).split(":")[0]}:${
					formatTime(time).split(":")[1]
				} - Hora de descansar!`
			}

			minutesSpan.textContent = formatTime(time).split(":")[0]
			secondsSpan.textContent = formatTime(time).split(":")[1]
		}
	}, 1000)
}

function reset() {
	clearInterval(interval)

	if (state === "pause") {
		time = pauseTime
		document.documentElement.style.setProperty("--main-color", "#38858A")
		document.documentElement.style.setProperty("--secondary-color", "#4C9196")
	} else if (state === "longpause") {
		time = longPauseTime
		document.documentElement.style.setProperty("--main-color", "#397097")
		document.documentElement.style.setProperty("--secondary-color", "#4D7FA2")
	} else {
		time = pomodoroTime
		document.documentElement.style.setProperty("--main-color", "#BA4949")
		document.documentElement.style.setProperty("--secondary-color", "#c15c5c")
	}
	highlightButton()
	minutesSpan.textContent = formatTime(time).split(":")[0]
	secondsSpan.textContent = formatTime(time).split(":")[1]
	startTimer()
}

pomodoroButton.addEventListener("click", () => {
	state = "pomodoro"
	reset()
})

intervalButton.addEventListener("click", () => {
	state = "pause"
	reset()
})

longIntervalButton.addEventListener("click", () => {
	state = "longpause"
	reset()
})

pauseButton.addEventListener("click", () => {
	isPaused = !isPaused

	if (isPaused === true) {
		pauseButton.textContent = "Começar"
		pauseButton.id = "pause-button"
	} else {
		pauseButton.textContent = "Parar"
		pauseButton.id = "start-button"
	}
})

// Exibe a div de configurações quando o botão é clicado
configButton.addEventListener("click", () => {
	configContainer.style.display = "block"
})

configContainer.addEventListener("click", (e) => {
	if (e.target === configContainer) {
		configClose.click()
	}
})

configClose.addEventListener("click", () => {
	configContainer.style.display = "none"
})

timerAutoButton.addEventListener("click", () => {
	if (autoStart) {
		autoStart = false
		timerAutoButton.classList.add("pretty-button-off")
		timerAutoButton.classList.remove("pretty-button-on")
		prettyButton.style.left = "2px"
	} else {
		autoStart = true
		pauseButton.click()
		timerAutoButton.classList.remove("pretty-button-off")
		timerAutoButton.classList.add("pretty-button-on")
		prettyButton.style.left = "auto"
		prettyButton.style.right = "2px"
	}
})

configContainer.addEventListener("submit", (event) => {
	event.preventDefault()
	var oldPomodoroTime = pomodoroTime
	var oldPauseTime = pauseTime
	var oldLongPauseTime = longPauseTime

	pomodoroTime = pomodoroInput.value * 60
	pauseTime = pauseInput.value * 60
	longPauseTime = longPauseInput.value * 60

	if (state === "pomodoro" && oldPomodoroTime != pomodoroTime) {
		reset()
	}

	if (state === "pause" && oldPauseTime != pauseTime) {
		reset()
	}

	if (state === "longpause" && oldLongPauseTime != longPauseTime) {
		reset()
	}

	intervals = intervalsInput.value
})

startTimer()
