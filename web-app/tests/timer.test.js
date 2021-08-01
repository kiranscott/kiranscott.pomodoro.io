import RemTime from "../static/remtime.js";


describe("Timer_tests", function () {
    it("Returns 0 when passed current time", function () {
        const testTime = new Date();
        const remainingTime = RemTime.getRemainingTime(testTime);
        if (remainingTime.seconds !== 0) {
            throw (
                "getRemainingTime returns" + remainingTime.seconds +
                "remaining seconds, expected remaining seconds to be 0"
            );
        }
        if (remainingTime.minutes !== 0) {
            throw (
                "getRemainingTime returns" + remainingTime.minutes +
                "remaining minutes, Expected remaining minutes to be 0"
            );
        }


    });

    it(
        "Returns remaining time" +
        "when passed a random time in the future",
        function () {
            //generates random integer between 0-3599
            //(any higher would cause rollover to hours)
            const randomSecond = Math.floor(Math.random() * 3599);
            const testTime = Date.parse(new Date()) + randomSecond * 1000;
            const remainingTime = RemTime.getRemainingTime(testTime);
            if (remainingTime.total > randomSecond) {
                throw ("getRemainingTime overshoots remaining time ");
            }
            if (remainingTime.total < randomSecond) {
                throw ("getRemainingTime undershoots remaining time ");
            }
        }
    );

    it("Returns minutes and seconds which are related to total", function () {
        const randomSecond = Math.floor(Math.random() * 3599);
        const testTime = Date.parse(new Date()) + randomSecond * 1000;
        const remainingTime = RemTime.getRemainingTime(testTime);
        if (
            remainingTime.total !==
            (remainingTime.minutes * 60) +
            remainingTime.seconds
        ) {
            throw (
                "getRemainingTime fails to split raw seconds into" +
                " minutes and seconds limited to base 60"
            );
        }
    });
});

