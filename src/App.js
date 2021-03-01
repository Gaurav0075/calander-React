import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css";
import CalIcon from "./assets/icon-next-date.svg";
import IconRight from "./assets/icon-left.svg";
import IconLeft from "./assets/icon-right.svg";

function App() {
  const weekDays = moment.weekdays();
  const [state, setState] = useState({
    currentDate: moment(new Date()),
    dateCells: [],
  });

  const setCurrentDate = (currentDate) => (e) => {
    setState(() => {
      const dateData = moment(currentDate);
      const monthFirstDay = dateData.startOf("month").format("d");
      const monthLastDay = dateData.endOf("month").format("d");
      const daysInMonth = dateData.daysInMonth();
      let newDateObj = [];

      let previousDateData = moment(currentDate);
      let previousMonthData = previousDateData.subtract(1, "months").format("MMM");
      let lastDayOfPrevMonth = parseInt(
        previousDateData.set({ month: previousMonthData }).endOf("month").format("D"),
        10
      );
      let yearOfPrevMonth = previousDateData
        .set({ month: previousMonthData })
        .endOf("month")
        .format("YYYY");

      for (let i = monthFirstDay; i > 0; i--) {
        let momentObject = moment().set({
          date: lastDayOfPrevMonth,
          month: previousMonthData,
          year: yearOfPrevMonth,
        });
        newDateObj = [
          {
            date: momentObject,
            isPrevious: true,
            hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
          },
        ].concat(newDateObj);
        --lastDayOfPrevMonth;
      }

      for (let i = 1; i <= daysInMonth; i++) {
        let momentObject = moment().set({
          date: i,
          month: dateData.format("MMM"),
          year: dateData.format("YYYY"),
        });
        newDateObj.push({
          date: momentObject,
          isCurrent: true,
          hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
        });
      }

      if (parseInt(monthLastDay, 10) < 6) {
        let nextDateData = moment(currentDate);
        let nextMonth = nextDateData.add(1, "months").format("MMM");
        nextDateData.set({ month: nextMonth });
        let firstDayOfNextMonth = 1;
        let yearOfNextMonth = nextDateData
          .set({ month: nextMonth })
          .format("YYYY");

        for (let i = parseInt(monthLastDay, 10); i < 6; i++) {
          let momentObject = moment().set({
            date: firstDayOfNextMonth,
            month: nextMonth,
            year: yearOfNextMonth,
          });
          newDateObj.push({
            date: momentObject,
            isNext: true,
            hasAppointments: i === 8 || i === 13 || i === 18 || i === 23,
          });
          ++firstDayOfNextMonth;
        }
      }

      newDateObj = newDateObj.map((date, i) => ({
        ...date,
        isToday: moment(currentDate.format("YYYY-MM-DD")).isSame(
          date.date.format("YYYY-MM-DD")
        ),
        weekOff: date.date.day() === 0 || date.date.day() === 6,
      }));
      
      return { currentDate: currentDate, dateCells: newDateObj };
    });
  }

  useEffect(() => {
    setCurrentDate(moment(new Date()))();
  }, []);

  return (
    <div className="App">
      <div className="cal-nav-bar">
        <button className="today-button mdl-button mdl-js-button mdl-js-ripple-effect" onClick={setCurrentDate(moment(new Date()))}>
          <img src={CalIcon} alt="calIcon" />
          <span>Today</span>
        </button>
        <div className="nav-buttons">
          <img src={IconLeft} alt="iconLeft" onClick={setCurrentDate(moment(state.currentDate).subtract(1, "months").set({ date: 1 }))} />
          <span>
            {state.currentDate.format("MMMM YYYY")}
          </span>
          <img src={IconRight} alt="iconRight"onClick={setCurrentDate(moment(state.currentDate).add(1, "months").set({ date: 1 }))}  />
        </div>
      </div>
      <div className="week-grid">
        {weekDays.map((day) => (
          <span key={day} className="calendar-header">
            {day.toUpperCase()}
          </span>
        ))}
      </div>
      <div className="days-grid">
        {state.dateCells.map((date, i) => {
            return (
              <div
                key={date.date.format("DDMMYYYY")}
                className={`calendar-cell${i % 2 === 0 ? " light" : " dark"}${(date.isNext || date.isPrevious || date.weekOff) ? " faded" : ""}`}
                onClick={setCurrentDate(date.date)}
              >
                <div className={`calendar-cell-inner${date.isToday ? " border" : ""}`}>
                  <span className="date">
                    {date.date.format("DD")}
                    {date.isToday && <small>{date.date.format("MMMM")}</small>}
                  </span>
                  {date.hasAppointments && !date.weekOff && (
                    <span className="caption">No Appointment</span>
                  )}
                  {date.weekOff && (
                    <span className="caption">Week Off</span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
