let pomodoroTime = 25 * 60
let pauseTime = 5 * 60
let longPauseTime = 10 * 60
let time
let interval
let pomodoros = 0
let isPaused = false
let state = "pomodoro"

const minutesSpan = document.getElementById("minutes")
const secondsSpan = document.getElementById("seconds")
const intervalButton = document.getElementById("interval-button")
const longIntervalButton = document.getElementById("long-interval-button")
const configButton = document.getElementById("config")
const pauseButton = document.getElementById("pause-button")
const pomodorosSpan = document.getElementById("pomodoros")

function formatTime(time) {
	const minutes = Math.floor(time / 60)
	const seconds = time % 60
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`
}

function startTimer() {
	if (state == "pomodoro") {
		time = pomodoroTime
	} else if (state == "pause") {
		time = pauseTime
	} else {
		time = longPauseTime
	}

	interval = setInterval(() => {
		if (!isPaused) {
			time--
			if (time < 0) {
				clearInterval(interval)

				//colocar som
				new Audio("notification.mp3").play()

				if (state == "pomodoro") {
					state = "pause"
				} else {
					state = "pomodoro"
				}

				startTimer()

				pomodoros++
				pomodorosSpan.textContent = pomodoros
			}
			minutesSpan.textContent = formatTime(time).split(":")[0]
			secondsSpan.textContent = formatTime(time).split(":")[1]
		}
	}, 1000)
}

intervalButton.addEventListener("click", () => {
	state = "pause"
	clearInterval(interval)
	startTimer()
})

longIntervalButton.addEventListener("click", () => {
	state = "longpause"
	clearInterval(interval)
	startTimer()
})

configButton.addEventListener("click", () => {
	pomodoroTime = prompt("Enter new time (in minutes): ") * 60
	if (state == "pomodoro") {
		clearInterval(interval)
		startTimer()
	}
})

pauseButton.addEventListener("click", () => {
	isPaused = !isPaused

	if (isPaused === true) {
		pauseButton.textContent = "Começar"
	} else {
		pauseButton.textContent = "Pausar"
	}
})

startTimer()
