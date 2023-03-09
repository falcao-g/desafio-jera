let pomodoroTime = 25 * 60
let pauseTime = 5 * 60
let longPauseTime = 10 * 60
let time
let interval
let pomodoros = 0
let isPaused = false
let state = "pomodoro"
const pomodoroColor = "coral"
const pomodoroDarkerColor = "darkred"
const pauseColor = "cadetblue"
const pauseDarkerColor = "darkblue"

const minutesSpan = document.getElementById("minutes")
const secondsSpan = document.getElementById("seconds")
const intervalButton = document.getElementById("interval-button")
const longIntervalButton = document.getElementById("long-interval-button")
const configButton = document.getElementById("config")
const pauseButton = document.getElementById("pause-button")
const pomodoroButton = document.getElementById("pomodoro-button")
const pomodorosSpan = document.getElementById("pomodoros")
const h1 = document.querySelector("h1")
const config = document.getElementById("config")
const box = document.getElementById("box")

function formatTime(time) {
	const minutes = Math.floor(time / 60)
	const seconds = time % 60
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`
}

function changeColor() {
	if (state == "pomodoro") {
		document.body.style.backgroundColor = pomodoroColor
		h1.style.color = pomodoroDarkerColor
		config.style.backgroundColor = pomodoroDarkerColor
		box.style.backgroundColor = pomodoroDarkerColor
	} else {
		document.body.style.backgroundColor = pauseColor
		h1.style.color = pauseDarkerColor
		config.style.backgroundColor = pauseDarkerColor
		box.style.backgroundColor = pauseDarkerColor
	}
}

function startTimer() {
	changeColor()
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
					pomodoroButton.classList.remove("highlight")
					intervalButton.classList.add("highlight")
					longIntervalButton.classList.remove("highlight")

					pomodoros++
					pomodorosSpan.textContent = pomodoros
				} else {
					state = "pomodoro"
					pomodoroButton.classList.add("highlight")
					intervalButton.classList.remove("highlight")
					longIntervalButton.classList.remove("highlight")
				}

				startTimer()
			}
			minutesSpan.textContent = formatTime(time).split(":")[0]
			secondsSpan.textContent = formatTime(time).split(":")[1]
		}
	}, 1000)
}

pomodoroButton.addEventListener("click", () => {
	pomodoroButton.classList.add("highlight")
	intervalButton.classList.remove("highlight")
	longIntervalButton.classList.remove("highlight")
	state = "pomodoro"
	clearInterval(interval)
	startTimer()
})

intervalButton.addEventListener("click", () => {
	pomodoroButton.classList.remove("highlight")
	intervalButton.classList.add("highlight")
	longIntervalButton.classList.remove("highlight")
	state = "pause"
	clearInterval(interval)
	startTimer()
})

longIntervalButton.addEventListener("click", () => {
	pomodoroButton.classList.remove("highlight")
	intervalButton.classList.remove("highlight")
	longIntervalButton.classList.add("highlight")
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
