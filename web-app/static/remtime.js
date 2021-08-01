const RemTime = Object.create(null);

//Takes a future Date() object and calculates the time remaining
//in total seconds as well as minutes + seconds
RemTime.getRemainingTime = function (endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
    //total number of seconds left. total = 230s => minutes = 3, seconds = 50
    const total = Number.parseInt(difference / 1000, 10);
    //number of whole minutes left (if any)
    const minutes = Number.parseInt((total / 60) % 60, 10);
    //number of seconds left after whole minutes have been accounted for
    const seconds = Number.parseInt(total % 60, 10);
    //object containing total, minutes and seconds is returned
    return {
        total,
        minutes,
        seconds
    };
};

export default Object.freeze(RemTime);