let pomodoroTime = 25 * 60
let pauseTime = 5 * 60
let longPauseTime = 10 * 60
let time = pomodoroTime
let interval
let pomodoros = 0
let isPaused = true
let state = "pomodoro"
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
const config = document.getElementById("config")

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

					if (pomodoros % 4 === 0) {
						if (Notification.permission === "granted") {
							new Notification("Hora da pausa!", {
								body: "Você fez 4 pomodoros, é recomendado que você faça uma pausa longa agora",
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
	document.documentElement.style.setProperty("--main-color", "cadetblue")
	document.documentElement.style.setProperty("--secondary-color", "darkblue")

	if (state === "pause") {
		time = pauseTime
	} else if (state === "longpause") {
		time = longPauseTime
	} else {
		time = pomodoroTime
		document.documentElement.style.setProperty("--main-color", "coral")
		document.documentElement.style.setProperty("--secondary-color", "darkred")
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

configButton.addEventListener("click", () => {
	pomodoroTime = prompt("Enter new time (in minutes): ") * 60
	if (state == "pomodoro") {
		reset()
	}
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

startTimer()
