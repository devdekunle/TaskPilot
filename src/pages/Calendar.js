import React from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchTasks, selectFilteredTasks } from "../store/slices/taskSlice";

import "../styles/calendar.css";

const Calendar = () => {
  return (
    <div className="calendar">
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "today prev, next",
          center: "title",
          end: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        height={"80vh"}
        events={[
          {
            title: "Event 1",
            start: "2023-06-19",
            end: "2023-06-29",
            color: "blue",
            backgroundColor: "lightblue",
          },
        ]}
      />
    </div>
  );
};

export default Calendar;
