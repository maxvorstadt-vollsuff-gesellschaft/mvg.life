'use client'


import React, {Component} from "react";
import PropTypes from "prop-types";

class Countdown extends Component {
    // @ts-ignore
    constructor(props) {
        super(props);

        this.state = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };
    }

    componentDidMount() {
        // update every second
        // @ts-ignore
        this.interval = setInterval(() => {
            // @ts-ignore
            const date = this.calculateCountdown(this.props.date);
            date ? this.setState(date) : this.stop();
        }, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    // @ts-ignore
    calculateCountdown(endDate) {
        // @ts-ignore
        let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

        // clear countdown when date is reached
        if (diff <= 0) return false;

        const timeLeft = {
            years: 0,
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };

        // calculate time difference between now and expected date
        if (diff >= 365.25 * 86400) {
            // 365.25 * 24 * 60 * 60
            timeLeft.years = Math.floor(diff / (365.25 * 86400));
            diff -= timeLeft.years * 365.25 * 86400;
        }
        if (diff >= 86400) {
            // 24 * 60 * 60
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            // 60 * 60
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }
        timeLeft.sec = diff;

        return timeLeft;
    }

    stop() {
        // @ts-ignore
        clearInterval(this.interval);
    }

    // @ts-ignore
    addLeadingZeros(value) {
        value = String(value);
        while (value.length < 2) {
            value = "0" + value;
        }
        return value;
    }

    render() {
        const countDown = this.state;

        return (
            <div className="flex gap-4">
                <div>
                    <p className="text-4xl font-bold font-mono">{this.addLeadingZeros(countDown.days)}</p>
                    <p className="text-xl">{countDown.days === 1 ? "Day" : "Days"}</p>
                </div>
                <div>
                    <p className="text-4xl font-bold font-mono">{this.addLeadingZeros(countDown.hours)}</p>
                    <p className="text-xl">Hours</p>
                </div>
                <div>
                    <p className="text-4xl font-bold font-mono">{this.addLeadingZeros(countDown.min)}</p>
                    <p className="text-xl">Min</p>
                </div>
                <div>
                    <p className="text-4xl font-bold font-mono">{this.addLeadingZeros(countDown.sec)}</p>
                    <p className="text-xl">Sec</p>
                </div>
            </div>
        );
    }
}

// @ts-ignore
Countdown.propTypes = {
    date: PropTypes.string.isRequired,
};

// @ts-ignore
Countdown.defaultProps = {
    date: new Date(),
};

export default Countdown;