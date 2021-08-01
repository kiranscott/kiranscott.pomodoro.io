import { timer } from "./main.js"; //import timer object

const Timer = Object.create(null);

//Function gets called every second by the interval in startTimer. Handles
//updating the html timer element, progress bar and app title
Timer.updateClock = function() {
    const { remainingTime } = timer;
    //extracts value of minutes and seconds properties on the remainingTime
    //object and pads them with zeros to preserve a width of 2 (8 -> 08)
    const minutes = `${remainingTime.minutes}`.padStart(2, "0");
    const seconds = `${remainingTime.seconds}`.padStart(2, "0");

    const min = document.getElementById("minutes");
    const sec = document.getElementById("seconds");
    const count = document.getElementById("counter");
    min.textContent = minutes;
    sec.textContent = seconds;
    //counter only increases once a full
    //study - short - study - short - study - short - study - long
    count.textContent = parseInt((timer.pomodoros - 1) / 4);

    //updates the title of the page according to time remaining, break and work
    const text = (timer.mode === "workSesh"
        ? "Study time!"
        : "Take a break!");
    document.title = `${minutes}:${seconds} — ${text}`;
    //everytime updateClock is called value attribute of progress bar updates
    //to remaining amount of seconds - total number of seconds in mode
    const progress = document.getElementById("progress");
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
};

//Handles switching timer mode from studying to short or long breaks
//does this by manipulating timer object
Timer.switchMode = function(mode) {
    //adds mode property to timer object (pomodoro, shortBreak or longBreak)
    timer.mode = mode;
    //adds remainingTime property to timer object containg 3 properties
    timer.remainingTime = {
        total: timer[mode] * 60, //total number of seconds remaining
        minutes: timer[mode], //number of minutes for the mode
        seconds: 0 //defaults to 0 at start of session
    };
    //active class removed from all mode buttons and set on the one that was
    //clicked, and background colour is updated
    document
        .querySelectorAll("button[data-mode]")
        .forEach((e) => e.classList.remove("active"));
    document.querySelector(`[data-mode="${mode}"]`).classList.add("active");
    document.body.style.backgroundColor = `var(--${mode})`;
    //sets max attribute of progress bar element to total seconds in countdown
    document
        .getElementById("progress")
        .setAttribute("max", timer.remainingTime.total);

    Timer.updateClock();
};


export default Object.freeze(Timer);