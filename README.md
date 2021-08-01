**CID:** [01852982]

# Project
This repository is for the submission of your **Computing 2: Applications** coursework.

You should complete the proforma and populate this repository with your project submission.

* **Repository Creation Check:** Tuesday 4th May 18:00 – Update your CID in this file to check your submission.
* **Peer Assessment Deadline:** Tuesday 8th June 18:00
* **Final Submission Deadline:** Thursday 17th June 16:00

# Computing 2 Submission Proforma

For each section, write a maximum of 200 words.

## Brief
The pomodoro technique is a tried and tested focus and productivity tool. My web app captures the simple nature of the pomodoro technique and pairs it with an intuitive interface and to-do list, allowing the user to be fully engaged in their work. 

The pomodoro technique consists of 25 minutes of work followed by a 5 minute break, and this cycle is repeated 4 times before taking a longer 20 minute break. This is represented by the timer section, where the user can switch between study, short break and long break modes. A pomodoro counter is also present next to the mode buttons. A progress bar is also used to quickly show the user how much time they have left in their session. Finally the page title is updated every second dynamically allowing the user to keep an eye on the timer remaining even when working on another tab. Audio queues alert the user when the timer switches to study or break mode.

The todo list section allows tasks to be added, marked as completed and deleted. The save button will send the current todo-array to the server and it will automatically load the array when the page is refreshed.

## Coding
The updated project has two main elements:
The timer section has been completely rewritten. The study, short break and long break durations are stored in the timer object in minutes.

Timer.js:
updateClock handles updating the html timer element based on the timer remaining. It also handles updating the document title as well as progressbar. The function gets called every second from within the interval

switchMode is a function that takes a timer mode as input (study , short break or long break). It then adds a mode and remainingtime property to the timer object. Then it handles adding the active flag to the appropriate mdoe button and changing the background colour. It then calls updateClock which reads the remainingtime property and uses it to set the inital values of the timer.

RemTime.js
getRemainingTime makes use of javascript's built in Date object. By comparing a Date object in the present with one in the future, it is easy to extract the number of minutes and seconds remaining until the current Date object reaches the future one. Parsing a Date object changes it from the format: dd/mm/yyyy hour:min:second to a raw integer that increases every by one every second. In this format, the current date can then be subtracted from the future date to get the total seconds remaining. Using a base 60 modulo operator can then split this into minutes remaining. Since this was one of the core functions of the timer section, I decided to write a series of tests testing edge cases and exemptions to make sure getRemainingTime wouldn't break.

Main.js:
startTimer is the main timer function. It handles the following:
-calculating the time in the future the timer should end based on the current timer mode
-handling the start / stop button
-using setInterval to do the following every second:
    -call updateClock
    -check if the timer has hit 0, and change to either a long or short break based on cycle count

stopTimer is much simpler and just handles stopping the interval and resetting the stop/start button.

handleMode pulls the mode value from one of the 3 mode buttons and passes it to switchMode. 


The todo-list section has been reworked to include Ajax and a client - server communication.

addTodoUI remains the same, and handles generating the UI elements for each todo item in the todo list. It takes one input which becomes the todo's content. It adds a complete and remove button using .createElement

deleteCheck adds functionality to the newly created remove and complete buttons. It calls the handler function delete_todos when the remove button is pressed, and it also plays a transition
The complete button adds a simple strikethough and flags the todo as completed.

Handler.js
A series of handler functions use Ajax to save and load the todos_list array to the server. A empty todos_list is created on the server side, which then gets set to the incoming one from the client side.
get_todos just returns this server side array with a promise
save_todos sets the server list to the incoming client list and returns a done promise
delete_todos uses a filter to remove elements from the server side array that matches the incoming client side object. Returns the updated server side list as a promise.

Push.js
anotherTodo is a simple function that takes the client side todo list and a new todo as inputs, then appends the new todo to the list. A series of property based tests were written around this function to perform simple checks regarding the list length and content.


## UX/UI
A number of css, js and html tricks were used to create the final UI of the web app.
Flex grid was used extensivley in the CSS to arrange the elements of the timer section in an even grid that dynamically resizes with the browser window.

The timer section was reworked to be simpler and more intuitive. A series of 3 mode buttons are found at the top of the web page, allowing the user to quickly switch between study and break modes if they desire. The timer will automatically switched modes once it hits 0. The start and pause button have been combined into a single button, as requested in the feedback to the initial web app.

## Data
The updated timer section makes heavy use of the Date data type to calculate and display remaining time. By parsing the date, it returns the number of milliseconds since January 1st 1970 00:00:00 UTC. Arithmetical functions can easily be performed when the Dates are in this integer formats, allowing time remaining in raw seconds, minutes and seconds to be easily calculated.

Object properties where also used to read / write attributes and set flags to a 'master' timer variable, which was then manipulated in different ways by various functions. Doing this packaged a lot of information into a single variable, and was also useful for debugging purposes as console.logging the timer object reveals a ton of information about the current state of the timer section.

The todo list consisted of a simple array where new todos where appended or removed. The variable on the client side was synced to the one on the server whenever the list was manipulated or modified.

## Debugging
When writing new functions I made use of console.log to check which part of the function was working (or not). Stackexchange was also a great help when debugging, as many users had previously encountered issues I was trying to resolve. I reccomend opening the console on firefox and seeing what gets logged as you interact with the timer.

## Best Practice
I ensured my main.js file fully passed JSLint, apart from a few errors regarding the Audio implementation that I unfortunately could not find a fix for. Intuitive HTML classes and ids as well as variable names were used. Finally, extensive use of comments to annotate my code.
